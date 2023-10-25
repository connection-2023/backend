import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GetLecturePaymentDto } from '../dtos/get-lecture-payment.dto';
import { PaymentsRepository } from '../repository/payments.repository';
import {
  Coupon,
  Coupons,
  LectureCoupon,
  LectureSchedule,
  ReservationInputData,
} from '../interface/payments.interface';
import { v4 as uuidV4 } from 'uuid';
import { PrismaService } from '@src/prisma/prisma.service';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import methods from 'cache-manager-redis-store';
import { LecturePayment, PaymentMethod, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService implements OnModuleInit {
  private readonly logger = new Logger(PaymentsService.name);

  private kftGetTokenUri: string;
  private kftClientId: string;
  private kftClientSecret: string;
  private kftScope: string;
  private kftGrantType: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly paymentsRepository: PaymentsRepository,
    private readonly prismaService: PrismaService,
  ) {}

  onModuleInit() {
    this.kftGetTokenUri = this.configService.get<string>('KFT_GET_TOKEN_URI');
    this.kftClientId = this.configService.get<string>('KFT_CLIENT_ID');
    this.kftClientSecret = this.configService.get<string>('KFT_CLIENT_SECRET');
    this.kftScope = this.configService.get<string>('KFT_SCOPE');
    this.kftGrantType = this.configService.get<string>('KFT_GRANT_TYPE');

    this.logger.log('PaymentsService Init');
  }

  async verifyBankAccount() {
    const accessToken = this.getKFTAccessToken();
  }

  private async getKFTAccessToken() {
    const data = {
      client_id: this.kftClientId,
      client_secret: this.kftClientSecret,
      scope: this.kftScope,
      grant_type: this.kftGrantType,
    };
    const response = await axios.post(this.kftGetTokenUri, data);
  }
  //만들어야할것 1. 렉처 페이먼트 굳
  //2.스케쥴 +
  //3.쿠폰 사용됨
  //4. reservation 생성
  //5. paymentCouponUsage
  async createLecturePaymentInfo(getLecturePaymentDto: GetLecturePaymentDto) {
    const { couponId, stackableCouponId } = getLecturePaymentDto;
    const lecture = await this.checkLectureValidity(getLecturePaymentDto);
    await this.checkUserPaymentValidity(1, getLecturePaymentDto.orderId);

    //강의 자리수 확인
    await this.comparePrice(1, lecture.price, getLecturePaymentDto);

    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const createdLecturePayment = await this.createLecturePayment(
          transaction,
          1,
          getLecturePaymentDto,
        );
        await this.updateUserCouponUsage(transaction, 1, {
          couponId,
          stackableCouponId,
        });
        await this.createUserReservation(
          transaction,
          createdLecturePayment.id,
          1,
          getLecturePaymentDto,
        );
      },
    );
  }

  private async checkLectureValidity({
    lectureId,
    couponId,
    stackableCouponId,
    lectureSchedules,
  }: GetLecturePaymentDto) {
    const lecture = await this.paymentsRepository.getLecture(lectureId);
    if (!lecture) {
      throw new NotFoundException(`강의정보가 존재하지 않습니다.`);
    }
    if (!lecture.isActive) {
      throw new BadRequestException(`활성화되지 않은 강의입니다.`);
    }
    //적용가능한 쿠폰인지 확인
    await this.checkApplicableCoupon(lectureId, couponId, stackableCouponId);
    //강의 인원수 확인
    await this.checkLectureSchedules(lecture.maxCapacity, lectureSchedules);

    return lecture;
  }

  private async checkUserPaymentValidity(userId, orderId) {
    const payment: LecturePayment =
      await this.paymentsRepository.getUserLecturePayment(userId, orderId);
    if (payment) {
      throw new BadRequestException(`결제정보가 이미 존재합니다.`);
    }
  }

  private async checkLectureSchedules(
    lectureMaxCapacity,
    lectureSchedules: LectureSchedule[],
  ) {
    const selectedLectureSchedules = [];
    for (const lectureSchedule of lectureSchedules) {
      const selectedSchedule = await this.paymentsRepository.getLectureSchedule(
        lectureSchedule.lectureScheduleId,
      );
      if (!selectedSchedule) {
        throw new NotFoundException(
          `scheduleId:${lectureSchedule.lectureScheduleId} 해당 강의 정보가 존재하지 않습니다.`,
        );
      }

      const remainingCapacity =
        lectureMaxCapacity - lectureSchedule.participants;

      if (remainingCapacity >= selectedSchedule.numberOfParticipants) {
        selectedLectureSchedules.push(selectedSchedule);
      } else {
        throw new BadRequestException(`인원초과입니다.`);
      }
    }
  }

  //적용할 쿠폰이 올바른지 확인
  private async checkApplicableCoupon(lectureId, couponId, stackableCouponId) {
    const couponIds: number[] = [couponId, stackableCouponId].filter(
      (id) => id !== null,
    );

    const couponTarget = await this.paymentsRepository.getLectureCouponTarget(
      lectureId,
      couponIds,
    );

    if (couponTarget.length !== couponIds.length) {
      throw new BadRequestException(`쿠폰 적용 대상이 아닙니다.`);
    }
  }

  private async comparePrice(
    userId: number,
    lecturePrice: number,
    {
      couponId,
      stackableCouponId,
      price: clientPrice,
      lectureSchedules,
    }: GetLecturePaymentDto,
  ) {
    let numberOfApplicants: number = 0;
    lectureSchedules.map((lectureSchedule) => {
      numberOfApplicants += lectureSchedule.participants;
    });

    const coupons: Coupons = await this.getUserCoupons(
      userId,
      couponId,
      stackableCouponId,
    );

    if (coupons) {
      this.calculateTotalPrice(
        clientPrice,
        lecturePrice,
        coupons,
        numberOfApplicants,
      );
    }
  }

  private calculateTotalPrice(
    clientPrice,
    lecturePrice,
    { coupon, stackableCoupon }: Coupons,
    numberOfApplicants,
  ) {
    let totalPrice: number = lecturePrice * numberOfApplicants;

    const applyDiscount = (price, discountInfo) => {
      if (
        discountInfo &&
        (discountInfo.percentage || discountInfo.discountPrice)
      ) {
        let discountAmount;
        if (discountInfo.percentage) {
          discountAmount = (price * discountInfo.percentage) / 100;
          if (discountInfo.maxDiscountPrice) {
            discountAmount = Math.min(
              discountAmount,
              discountInfo.maxDiscountPrice,
            );
          }
        } else if (discountInfo.discountPrice) {
          discountAmount = discountInfo.discountPrice;
        }
        price -= discountAmount;
        if (price <= 0) {
          return 0;
        }
      }
      return price;
    };

    if (coupon) {
      totalPrice = applyDiscount(totalPrice, coupon);
    }
    if (stackableCoupon) {
      totalPrice = applyDiscount(totalPrice, stackableCoupon);
    }
    if (clientPrice !== totalPrice) {
      throw new BadRequestException(`상품 가격이 일치하지 않습니다.`);
    }

    return totalPrice;
  }

  private async getUserCoupons(
    userId,
    couponId,
    stackableCouponId,
  ): Promise<Coupons> {
    const coupons: Coupons = {};

    if (couponId) {
      coupons.coupon = await this.getCoupon(userId, couponId, false);
    }
    if (stackableCouponId) {
      coupons.stackableCoupon = await this.getCoupon(
        userId,
        stackableCouponId,
        true,
      );
    }
    if (coupons.coupon && coupons.stackableCoupon) {
      if (coupons.coupon.percentage && coupons.stackableCoupon.percentage) {
        throw new BadRequestException(`할인율은 중복적용이 불가능합니다.`);
      }
    }
    return coupons;
  }

  private async getCoupon(userId, couponId, stackable): Promise<Coupon> {
    const coupon: LectureCoupon = await this.paymentsRepository.getUserCoupon(
      userId,
      couponId,
      stackable,
    );
    if (!coupon) {
      throw new NotFoundException(
        `${stackable ? '중복 쿠폰' : '쿠폰'}이 존재하지 않습니다.`,
      );
    }
    return { ...coupon.lectureCoupon };
  }

  private async createLecturePayment(
    transaction,
    userId,
    getLecturePaymentDto: GetLecturePaymentDto,
  ): Promise<LecturePayment> {
    const { method, orderName, price, orderId } = getLecturePaymentDto;

    const paymentMethod: PaymentMethod =
      await this.paymentsRepository.getPaymentMethod(method);
    const paymentStatus: PaymentStatus =
      await this.paymentsRepository.getPaymentStatus('결제대기');

    const lecturePaymentData = {
      userId,
      orderId,
      orderName,
      paymentMethodId: paymentMethod.id,
      statusId: paymentStatus.id,
      price,
    };

    return await this.paymentsRepository.createLecturePayment(
      transaction,
      lecturePaymentData,
    );
  }

  private async createUserReservation(
    transaction,
    lecturePaymentId,
    userId,
    getLecturePaymentDto: GetLecturePaymentDto,
  ) {
    const { lectureSchedules, representative, phoneNumber, requests } =
      getLecturePaymentDto;
    for (const lectureSchedule of lectureSchedules) {
      await this.paymentsRepository.trxUpdateLectureScheduleParticipants(
        transaction,
        lectureSchedule,
      );
      const reservationInputData: ReservationInputData = {
        userId,
        lecturePaymentId,
        representative,
        phoneNumber,
        requests,
        ...lectureSchedule,
      };
      await this.paymentsRepository.trxCreateReservation(
        transaction,
        reservationInputData,
      );
    }
  }

  private async updateUserCouponUsage(
    transaction: PrismaTransaction,
    userId: number,
    coupons,
  ) {}
}
