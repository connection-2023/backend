import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetLecturePaymentDto } from '@src/payments/dtos/get-lecture-payment.dto';
import { PaymentsRepository } from '@src/payments/repository/payments.repository';
import {
  CardInfo,
  Coupon,
  Coupons,
  LectureCoupon,
  LectureCouponUseage,
  LectureSchedule,
  PaymentInfo,
  ReservationInputData,
  TossPaymentsConfirmResponse,
} from '@src/payments/interface/payments.interface';
import { PrismaService } from '@src/prisma/prisma.service';
import { Card, Lecture, Payment } from '@prisma/client';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import { ConfirmLecturePaymentDto } from '@src/payments/dtos/get-lecture-payment.dto copy';
import {
  PaymentMethods,
  PaymentProductTypes,
  PaymentOrderStatus,
} from '@src/payments/enum/payment.enum';
import axios from 'axios';

@Injectable()
export class PaymentsService implements OnModuleInit {
  private readonly logger = new Logger(PaymentsService.name);

  private kftGetTokenUri: string;
  private kftClientId: string;
  private kftClientSecret: string;
  private kftScope: string;
  private kftGrantType: string;
  private tossPaymentsSecretKey: string;
  private tossPaymentsUrl: string;

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
    this.tossPaymentsSecretKey = this.configService.get<string>(
      'TOSS_PAYMENTS_SECRET_KEY',
    );
    this.tossPaymentsUrl = this.configService.get<string>('TOSS_PAYMENTS_URL');

    this.logger.log('PaymentsService Init');
  }

  // async verifyBankAccount() {
  //   const accessToken = this.getKFTAccessToken();
  // }

  // private async getKFTAccessToken() {
  //   const data = {
  //     client_id: this.kftClientId,
  //     client_secret: this.kftClientSecret,
  //     scope: this.kftScope,
  //     grant_type: this.kftGrantType,
  //   };
  //   const response = await axios.post(this.kftGetTokenUri, data);
  // }

  async createLecturePaymentInfo(
    userId: number,
    getLecturePaymentDto: GetLecturePaymentDto,
  ) {
    const lecture: Lecture = await this.checkLectureValidity(
      getLecturePaymentDto,
    );
    await this.checkUserPaymentValidity(userId, getLecturePaymentDto.orderId);

    // 강의 자리수 확인 및 쿠폰 비교
    const coupons = await this.comparePrice(
      userId,
      lecture.price,
      getLecturePaymentDto,
    );

    await this.createPaymentTransaction(
      lecture.lecturerId,
      userId,
      getLecturePaymentDto,
      coupons,
    );

    const lecturePaymentInfo = {
      orderId: getLecturePaymentDto.orderId,
      orderName: getLecturePaymentDto.orderName,
      value: getLecturePaymentDto.price,
      method: getLecturePaymentDto.method,
    };

    return lecturePaymentInfo;
  }

  private async createPaymentTransaction(
    lecturerId: number,
    userId: number,
    getLecturePaymentDto: GetLecturePaymentDto,
    coupons: Coupons,
  ): Promise<void> {
    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const paymentInfo = {
          method: getLecturePaymentDto.method,
          orderName: getLecturePaymentDto.orderName,
          price: getLecturePaymentDto.price,
          orderId: getLecturePaymentDto.orderId,
        };

        const createdLecturePayment: Payment = await this.createPayment(
          transaction,
          lecturerId,
          userId,
          paymentInfo,
          PaymentProductTypes.강의,
        );

        await Promise.all([
          this.updateCouponUsage(
            transaction,
            userId,
            createdLecturePayment.id,
            coupons,
          ),
          this.createUserReservation(
            transaction,
            userId,
            createdLecturePayment.id,
            getLecturePaymentDto,
          ),
        ]);
      },
    );
  }

  private async checkLectureValidity({
    lectureId,
    couponId,
    stackableCouponId,
    lectureSchedules,
  }: GetLecturePaymentDto): Promise<Lecture> {
    const lecture: Lecture = await this.paymentsRepository.getLecture(
      lectureId,
    );
    if (!lecture) {
      throw new NotFoundException(`강의정보가 존재하지 않습니다.`);
    }
    if (!lecture.isActive) {
      throw new BadRequestException(`활성화되지 않은 강의입니다.`);
    }

    Promise.all([
      //적용가능한 쿠폰인지 확인
      (await this.checkApplicableCoupon(lectureId, couponId, stackableCouponId),
      //강의 인원수 확인
      await this.checkLectureSchedules(lecture.maxCapacity, lectureSchedules)),
    ]);

    return lecture;
  }

  private async checkUserPaymentValidity(userId, orderId): Promise<void> {
    const payment: Payment =
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

    const couponTarget: LectureCouponUseage[] =
      await this.paymentsRepository.getLectureCouponTarget(
        lectureId,
        couponIds,
      );

    if (couponTarget.length !== couponIds.length) {
      throw new BadRequestException(`쿠폰 적용 대상이 아닙니다.`);
    }
    for (const coupon of couponTarget) {
      if (
        coupon.lectureCoupon.maxUsageCount === coupon.lectureCoupon.usageCount
      ) {
        throw new BadRequestException(`쿠폰 사용 제한 횟수를 초과했습니다.`);
      }
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
  ): Promise<Coupons> {
    let numberOfApplicants: number = 0;
    lectureSchedules.map((lectureSchedule) => {
      numberOfApplicants += lectureSchedule.participants;
    });

    if (couponId || stackableCouponId) {
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

        return coupons;
      }
    } else if (clientPrice !== lecturePrice * numberOfApplicants) {
      throw new BadRequestException(`상품 가격이 일치하지 않습니다.`);
    }
  }

  private calculateTotalPrice(
    clientPrice: number,
    lecturePrice: number,
    coupons: Coupons,
    numberOfApplicants: number,
  ): void {
    // 기본 가격
    let totalPrice: number = lecturePrice * numberOfApplicants;

    // 쿠폰 적용
    totalPrice = this.applyDiscount(totalPrice, coupons);

    // 최종 가격과 클라이언트 가격 비교
    if (clientPrice !== totalPrice) {
      throw new BadRequestException(`상품 가격이 일치하지 않습니다.`);
    }
  }

  // 할인 적용 함수
  private applyDiscount(price: number, coupons: Coupons): number {
    const applyPercentageDiscount = (
      price: number,
      percentage: number,
      maxDiscountPrice: number | null,
    ): number => {
      const discountAmount = (price * percentage) / 100;
      if (maxDiscountPrice !== null) {
        return price - Math.min(discountAmount, maxDiscountPrice);
      } else {
        return price - discountAmount;
      }
    };

    if (coupons.coupon && coupons.stackableCoupon) {
      if (coupons.coupon.percentage !== null) {
        price = applyPercentageDiscount(
          price,
          coupons.coupon.percentage,
          coupons.coupon.maxDiscountPrice,
        );
      } else if (coupons.stackableCoupon.percentage !== null) {
        price = applyPercentageDiscount(
          price,
          coupons.stackableCoupon.percentage,
          coupons.stackableCoupon.maxDiscountPrice,
        );
      }

      if (coupons.coupon.discountPrice !== null) {
        price -= coupons.coupon.discountPrice;
      } else if (coupons.stackableCoupon.discountPrice !== null) {
        price -= coupons.stackableCoupon.discountPrice;
      }
    } else if (coupons.coupon) {
      if (coupons.coupon.percentage !== null) {
        price = applyPercentageDiscount(
          price,
          coupons.coupon.percentage,
          coupons.coupon.maxDiscountPrice,
        );
      } else if (coupons.coupon.discountPrice !== null) {
        price -= coupons.coupon.discountPrice;
      }
    } else if (coupons.stackableCoupon) {
      if (coupons.stackableCoupon.percentage !== null) {
        price = applyPercentageDiscount(
          price,
          coupons.stackableCoupon.percentage,
          coupons.stackableCoupon.maxDiscountPrice,
        );
      } else if (coupons.stackableCoupon.discountPrice !== null) {
        price -= coupons.stackableCoupon.discountPrice;
      }
    }

    if (price <= 0) {
      return 0;
    }

    return price;
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

  private async getCoupon(
    userId: number,
    couponId: number,
    stackable: boolean,
  ): Promise<Coupon> {
    const coupon: LectureCoupon = await this.paymentsRepository.getUserCoupon(
      userId,
      couponId,
      stackable,
    );
    if (!coupon) {
      throw new NotFoundException(
        `사용가능한 ${stackable ? '중복 쿠폰' : '쿠폰'}이 존재하지 않습니다.`,
      );
    }
    return { ...coupon.lectureCoupon };
  }

  private async createPayment(
    transaction: PrismaTransaction,
    lecturerId: number,
    userId: number,
    paymentInfo: PaymentInfo,
    productType: PaymentProductTypes,
  ): Promise<Payment> {
    const { method, orderName, price, orderId } = paymentInfo;
    const statusId: number =
      PaymentMethods[method as unknown as keyof typeof PaymentMethods];

    const [paymentMethod, paymentStatus, paymentType] = await Promise.all([
      this.paymentsRepository.getPaymentMethod(statusId),
      this.paymentsRepository.getPaymentStatus(PaymentOrderStatus.READY),
      this.paymentsRepository.getPaymentProductType(productType),
    ]);

    const lecturePaymentData = {
      lecturerId,
      userId,
      orderId,
      orderName,
      paymentMethodId: paymentMethod.id,
      statusId: paymentStatus.id,
      paymentProductTypeId: paymentType.id,
      price,
    };

    return await this.paymentsRepository.createPayment(
      transaction,
      lecturePaymentData,
    );
  }

  private async createUserReservation(
    transaction: PrismaTransaction,
    userId: number,
    paymentId: number,
    getLecturePaymentDto: GetLecturePaymentDto,
  ): Promise<void> {
    const { lectureSchedules, representative, phoneNumber, requests } =
      getLecturePaymentDto;

    for (const lectureSchedule of lectureSchedules) {
      await this.paymentsRepository.trxUpdateLectureScheduleParticipants(
        transaction,
        lectureSchedule,
      );

      const reservationInputData: ReservationInputData = {
        userId,
        paymentId,
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

  private async updateCouponUsage(
    transaction: PrismaTransaction,
    userId: number,
    paymentId: number,
    coupons: Coupons,
  ): Promise<void> {
    if (!coupons) {
      return;
    }

    const couponIds: number[] = Object.values(coupons)
      .map((coupon) => coupon?.id)
      .filter((id: number) => id !== null);

    const paymentCouponUsageInputData = { paymentId };

    if (coupons.coupon) {
      const couponData = coupons.coupon;
      Object.assign(paymentCouponUsageInputData, {
        couponId: couponData.id,
        couponPercentage: couponData.percentage,
        couponDiscountPrice: couponData.discountPrice,
        couponMaxDiscountPrice: couponData.maxDiscountPrice,
      });
    }

    if (coupons.stackableCoupon) {
      const stackableCouponData = coupons.stackableCoupon;
      Object.assign(paymentCouponUsageInputData, {
        stackableCouponId: stackableCouponData.id,
        stackableCouponPercentage: stackableCouponData.percentage,
        stackableCouponDiscountPrice: stackableCouponData.discountPrice,
        stackableCouponMaxDiscountPrice: stackableCouponData.maxDiscountPrice,
      });
    }

    if (couponIds.length > 0) {
      await Promise.all([
        this.paymentsRepository.trxUpdateLectureCouponUseage(
          transaction,
          couponIds,
        ),
        this.paymentsRepository.trxCreatePaymentCouponUsage(
          transaction,
          paymentCouponUsageInputData,
        ),
        this.paymentsRepository.trxUpdateUserCouponUsage(
          transaction,
          userId,
          couponIds,
        ),
      ]);
    }
  }

  async confirmLecturePayment(
    confirmLecturePaymentDto: ConfirmLecturePaymentDto,
  ) {
    const { orderId, amount, paymentKey } = confirmLecturePaymentDto;
    await this.validateLecturePaymentInfo(
      { orderId, amount },
      PaymentOrderStatus.READY,
    );
    const paymentStatus = await this.paymentsRepository.getPaymentStatus(
      PaymentOrderStatus.IN_PROGRESS,
    );
    //무통장정보, 카드정보, 카드번호, 카드회사 코드, 은행코드, 계좌번호..?
    const updatedPayment = await this.paymentsRepository.updateLecturePayment(
      orderId,
      {
        paymentKey,
        statusId: paymentStatus.id,
      },
    );
    // const paymentInfo: TossPaymentsConfirmResponse =
    //   await this.authorizeTossPaymentApiServer({
    //     orderId,
    //     amount,
    //     paymentKey,
    //   });
    const paymentInfo = {
      card: {
        issuerCode: '24',
        acquirerCode: '21',
        number: '53275080****161*',
        installmentPlanMonths: 0,
        isInterestFree: false,
        interestPayer: null,
        approveNo: '00000000',
        useCardPoint: false,
        cardType: '신용',
        ownerType: '개인',
        acquireStatus: 'READY',
        amount: 35000,
      },
    };

    if (paymentInfo.card) {
      await this.createCardPaymentInfo(updatedPayment.id, paymentInfo.card);
    }
    return {};
  }
  private async createCardPaymentInfo(
    paymentId: number,
    cardPaymentInfo: CardInfo,
  ) {
    const {
      issuerCode,
      acquireStatus,
      number,
      installmentPlanMonths,
      approveNo,
      cardType,
      ownerType,
      isInterestFree,
    } = cardPaymentInfo;

    await this.validateCardCode(issuerCode);
    if (acquireStatus) {
      await this.validateCardCode(acquireStatus);
    }

    const cardPaymentInfoInputData = {
      paymentId,
      issuerCode,
    };
  }

  private async validateCardCode(cardCode: string): Promise<void> {
    const selectedCard: Card = await this.paymentsRepository.getCard(cardCode);
    if (!selectedCard) {
      throw new BadRequestException(`잘못된 카드Code입니다`, 'InvalidCardCode');
    }
  }

  private async validateLecturePaymentInfo(
    lecturePayment: PaymentInfo,
    paymentStatus: PaymentOrderStatus,
  ) {
    const paymentInfo = await this.paymentsRepository.getLecturePaymentInfo(
      lecturePayment.orderId,
    );
    if (!paymentInfo) {
      throw new NotFoundException(
        `결제 정보가 존재하지 않습니다.`,
        'PaymentInfoNotFound',
      );
    }

    if (lecturePayment.amount !== paymentInfo.price) {
      throw new BadRequestException(
        `결제 금액이 일치하지 않습니다.`,
        'PaymentAmountMismatch',
      );
    }

    if (paymentInfo.paymentStatus.name !== paymentStatus) {
      throw new BadRequestException(
        `해당 결제 정보는 ${paymentInfo.paymentStatus.name}상태 입니다.`,
        'PaymentStatusMismatch',
      );
    }
  }

  private async authorizeTossPaymentApiServer(
    paymentInfo: PaymentInfo,
  ): Promise<TossPaymentsConfirmResponse> {
    try {
      const tossSkKey = Buffer.from(`${this.tossPaymentsSecretKey}:`).toString(
        'base64',
      );
      const response = await axios.post(
        `${this.tossPaymentsUrl}/confirm`,
        paymentInfo,
        {
          headers: {
            Authorization: `Basic ${tossSkKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (
        response.data.status === PaymentOrderStatus.DONE &&
        response.data.card
      ) {
        return { card: response.data.card };
      }
      if (
        response.data.status === PaymentOrderStatus.WAITING_FOR_DEPOSIT &&
        response.data.virtualAccount
      ) {
        return { virtualAccount: response.data.virtualAccount };
      }
      if (!response.data) {
        throw new InternalServerErrorException(`${response.data}`, 'erer');
      }
    } catch (error) {
      if (error.response.data) {
        throw new InternalServerErrorException(
          `${error.response.data.message}`,
          error.response.data.code,
        );
      }

      throw error;
    }
  }
}
