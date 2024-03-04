import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateLecturePaymentWithTossDto } from '@src/payments/dtos/create-lecture-payment-with-toss.dto';
import { PaymentsRepository } from '@src/payments/repository/payments.repository';
import {
  CardPaymentInfoInputData,
  Coupon,
  Coupons,
  IPaymentResult,
  ISelectedUserPass,
  LectureCoupon,
  LectureCouponUseage,
  ILectureSchedule,
  PaymentInfo,
  ReservationInputData,
  TossPaymentCardInfo,
  TossPaymentVirtualAccountInfo,
  TossPaymentsConfirmResponse,
  VirtualAccountPaymentInfoInputData,
  IWebHookData,
  IRefundPaymentInfo,
  IRefundReceiveAccount,
  ICalculatedLectureRefundResult,
} from '@src/payments/interface/payments.interface';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  Card,
  Lecture,
  LecturePass,
  Payment,
  PaymentCouponUsage,
  PaymentProductType,
  PaymentStatus,
  Reservation,
  UserBankAccount,
  UserPass,
} from '@prisma/client';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import { ConfirmLecturePaymentDto as ConfirmPaymentDto } from '@src/payments/dtos/confirm-lecture-payment.dto';
import {
  PaymentMethods,
  PaymentProductTypes,
  PaymentOrderStatus,
  RefundStatuses,
  LectureMethod,
  PaymentHistoryTypes,
} from '@src/payments/enum/payment.enum';
import axios from 'axios';
import { CreatePassPaymentDto } from '@src/payments/dtos/create-pass-payment.dto';
import { CreateLecturePaymentWithPassDto } from '@src/payments/dtos/create-lecture-payment-with-pass.dto';
import { CreateLecturePaymentWithTransferDto } from '../dtos/create-lecture-payment-with-transfer.dto';
import { PaymentDto } from '../dtos/payment.dto';
import { CreateLecturePaymentWithDepositDto } from '../dtos/create-lecture-payment-with-deposit';
import { PendingPaymentInfoDto } from '../dtos/pending-payment-info.dto';
import { HandleRefundDto } from '../dtos/request/handle-refund.dto';

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
  private oneHour: number;
  private cancellationAbsoluteTime: number;
  private passRefundableDaysPeriod: number;

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

    this.oneHour = 60 * 60 * 1000;
    this.cancellationAbsoluteTime = this.configService.get<number>(
      'CANCELLATION_ABSOLUTE_TIME',
    );
    this.passRefundableDaysPeriod = this.configService.get<number>(
      'PASS_REFUNDABLE_DAYS_PERIOD',
    );

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

  async createLecturePaymentWithToss(
    userId: number,
    dto: CreateLecturePaymentWithTossDto,
  ): Promise<PendingPaymentInfoDto> {
    const { lectureId, lectureSchedule } = dto;
    const { lecture, refundableDate } = await this.checkLectureValidity(
      lectureId,
      lectureSchedule,
    );

    await this.checkUserPaymentValidity(userId, dto.orderId);
    await this.checkApplicableCoupon(dto);

    // 강의 자리수 확인 및 쿠폰 비교
    const coupons: Coupons = await this.comparePrice(
      userId,
      lecture.price,
      dto,
    );

    await this.trxCreateLecturePaymentWithToss(
      userId,
      lecture,
      dto,
      coupons,
      refundableDate,
    );

    return new PendingPaymentInfoDto({
      orderId: dto.orderId,
      orderName: dto.orderName,
      value: dto.finalPrice,
    });
  }

  private async trxCreateLecturePaymentWithToss(
    userId: number,
    { id: lectureId, lecturerId, lectureMethodId }: Lecture,
    createLecturePaymentDto: CreateLecturePaymentWithTossDto,
    coupons: Coupons,
    refundableDate: Date,
  ): Promise<void> {
    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const paymentInfo = this.createPaymentInfo(createLecturePaymentDto);
        const createdLecturePayment: Payment = await this.trxCreatePayment(
          transaction,
          lecturerId,
          userId,
          paymentInfo,
          PaymentProductTypes.클래스,
          PaymentOrderStatus.READY,
          refundableDate,
        );

        await Promise.all([
          this.trxUpdateCouponUsage(
            transaction,
            userId,
            createdLecturePayment.id,
            coupons,
          ),
          this.trxCreateUserReservation(
            transaction,
            userId,
            createdLecturePayment.id,
            createLecturePaymentDto,
            lectureMethodId,
            lectureId,
          ),
          this.trxCreateOrUpdateLectureLearner(transaction, userId, lecturerId),
        ]);
      },
    );
  }

  private async checkLectureValidity(
    lectureId: number,
    lectureSchedule: ILectureSchedule,
  ): Promise<{ lecture: Lecture; refundableDate: Date }> {
    const lecture: Lecture = await this.paymentsRepository.getLecture(
      lectureId,
    );

    if (!lecture) {
      throw new NotFoundException(`강의정보가 존재하지 않습니다.`);
    }
    if (!lecture.isActive) {
      throw new BadRequestException(`활성화되지 않은 강의입니다.`);
    }

    //강의 인원수 확인및 데드라인을 통한 환불 가능한 시간(예약 마감일) 계산
    const refundableDate = await this.checkLectureSchedules(
      lecture.lectureMethodId,
      lecture.maxCapacity,
      lectureSchedule,
      lecture.reservationDeadline,
    );

    const currentDate = this.getCurrentDate();

    //현재 신청 시간이 환불 가능한 시간(예약 마감일)보다 지났을때
    if (currentDate.getTime() > refundableDate.getTime()) {
      throw new BadRequestException(`예약 마감일이 지난 강의입니다.`);
    }

    return { lecture, refundableDate };
  }

  private async checkUserPaymentValidity(
    userId: number,
    orderId: string,
  ): Promise<void> {
    const payment: Payment =
      await this.paymentsRepository.getUserLecturePayment(userId, orderId);
    if (payment) {
      throw new BadRequestException(
        `결제정보가 이미 존재합니다.`,
        'PaymentAlreadyExists',
      );
    }
  }

  private async checkLectureSchedules(
    lectureMethod: number,
    lectureMaxCapacity: number,
    lectureSchedule: ILectureSchedule,
    reservationDeadline: number,
  ) {
    switch (lectureMethod) {
      case LectureMethod.원데이:
        return this.checkOneDayLecture(
          lectureMaxCapacity,
          lectureSchedule,
          reservationDeadline,
        );
      case LectureMethod.정기:
        return this.checkRegularLecture(
          lectureMaxCapacity,
          lectureSchedule,
          reservationDeadline,
        );
      default:
        throw new BadRequestException(`잘못된 강의 방식입니다.`);
    }
  }

  //원데이 클래스 확인 및 예약 마감일 설정
  private async checkOneDayLecture(
    lectureMaxCapacity: number,
    lectureSchedule: ILectureSchedule,
    reservationDeadline: number,
  ) {
    const selectedOneDaySchedule =
      await this.paymentsRepository.getLectureSchedule(
        lectureSchedule.lectureScheduleId,
      );

    if (!selectedOneDaySchedule) {
      throw new NotFoundException(`해당 강의 정보가 존재하지 않습니다.`);
    }

    const remainingCapacity = lectureMaxCapacity - lectureSchedule.participants;
    if (remainingCapacity <= selectedOneDaySchedule.numberOfParticipants) {
      throw new BadRequestException(`인원 초과입니다.`);
    }

    return new Date(
      selectedOneDaySchedule.startDateTime.getTime() -
        reservationDeadline * this.oneHour,
    );
  }

  //정기 클래스 확인 및 예약 마감일 설정
  private async checkRegularLecture(
    lectureMaxCapacity: number,
    lectureSchedule: ILectureSchedule,
    reservationDeadline: number,
  ) {
    const [selectedRegularLectureStatus, selectedRegularLectureSchedule] =
      await Promise.all([
        this.paymentsRepository.getRegularLectureStatus(
          lectureSchedule.lectureScheduleId,
        ),
        this.paymentsRepository.getRegularLectureSchedule(
          lectureSchedule.lectureScheduleId,
        ),
      ]);

    const remainingCapacity = lectureMaxCapacity - lectureSchedule.participants;
    if (
      remainingCapacity <= selectedRegularLectureStatus.numberOfParticipants
    ) {
      throw new BadRequestException(`인원 초과입니다.`);
    }

    return new Date(
      selectedRegularLectureSchedule.startDateTime.getTime() -
        reservationDeadline * this.oneHour,
    );
  }

  //적용할 쿠폰이 올바른지 확인
  private async checkApplicableCoupon({
    lectureId,
    couponId,
    stackableCouponId,
  }: CreateLecturePaymentWithTossDto) {
    const couponIds: number[] = [couponId, stackableCouponId].filter(
      (id) => id != null && id !== undefined,
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
    lectureOriginalPrice: number,
    dto: CreateLecturePaymentWithTossDto | CreateLecturePaymentWithTransferDto,
  ): Promise<Coupons> {
    const {
      couponId,
      stackableCouponId,
      finalPrice: clientPrice,
      lectureSchedule,
    } = dto;

    if (couponId || stackableCouponId) {
      const coupons: Coupons = await this.getUserCoupons(
        userId,
        couponId,
        stackableCouponId,
      );

      //쿠폰이 있을때 계산한 가격과 요청으로 들어온 가격이 맞는지 계산하여 비교
      if (coupons) {
        this.calculateTotalPrice(
          clientPrice,
          lectureOriginalPrice,
          coupons,
          lectureSchedule.participants,
        );

        return coupons;
      }
    }
    //쿠폰이 없을때 계산한 가격과 요청으로 들어온 가격이 맞는지 계산하여 비교
    else if (
      clientPrice !==
      lectureOriginalPrice * lectureSchedule.participants
    ) {
      throw new BadRequestException(
        `상품 가격이 일치하지 않습니다.`,
        'ProductPriceMismatch',
      );
    }
  }

  private calculateTotalPrice(
    clientPrice: number,
    lectureOriginalPrice: number,
    coupons: Coupons,
    numberOfApplicants: number,
  ): void {
    // 기본 가격
    let totalPrice: number = lectureOriginalPrice * numberOfApplicants;

    // 쿠폰 적용
    totalPrice = this.applyDiscount(totalPrice, coupons);

    // 최종 가격과 클라이언트 가격 비교
    if (clientPrice !== totalPrice) {
      throw new BadRequestException(
        `상품 가격이 일치하지 않습니다.`,
        'ProductPriceMismatch',
      );
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
    const { coupon, stackableCoupon } = coupons;
    if (coupon && stackableCoupon) {
      if (coupon.percentage !== null) {
        price = applyPercentageDiscount(
          price,
          coupon.percentage,
          coupon.maxDiscountPrice,
        );
      } else if (stackableCoupon.percentage !== null) {
        price = applyPercentageDiscount(
          price,
          stackableCoupon.percentage,
          stackableCoupon.maxDiscountPrice,
        );
      }

      if (coupon.discountPrice !== null) {
        price -= coupon.discountPrice;
      } else if (stackableCoupon.discountPrice !== null) {
        price -= stackableCoupon.discountPrice;
      }
    } else if (coupon) {
      if (coupon.percentage !== null) {
        price = applyPercentageDiscount(
          price,
          coupon.percentage,
          coupon.maxDiscountPrice,
        );
      } else if (coupon.discountPrice !== null) {
        price -= coupon.discountPrice;
      }
    } else if (stackableCoupon) {
      if (stackableCoupon.percentage !== null) {
        price = applyPercentageDiscount(
          price,
          stackableCoupon.percentage,
          stackableCoupon.maxDiscountPrice,
        );
      } else if (stackableCoupon.discountPrice !== null) {
        price -= stackableCoupon.discountPrice;
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
        throw new BadRequestException(
          `할인율은 중복적용이 불가능합니다.`,
          'DuplicateDiscount',
        );
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
        'NoAvailableCouponsError',
      );
    }
    return { ...coupon.lectureCoupon };
  }

  private createPaymentInfo(
    data:
      | CreatePassPaymentDto
      | CreateLecturePaymentWithTossDto
      | CreateLecturePaymentWithPassDto
      | CreateLecturePaymentWithTransferDto,
  ): PaymentInfo {
    const paymentInfo = {
      orderId: data.orderId,
      orderName: data.orderName,
      originalPrice: data.originalPrice,
      finalPrice: data.finalPrice,
    };

    return paymentInfo;
  }

  private async trxCreatePayment(
    transaction: PrismaTransaction,
    lecturerId: number,
    userId: number,
    paymentInfo: PaymentInfo,
    productType: PaymentProductTypes,
    statusId: number,
    refundableDate: Date,
    paymentMethodId?: number,
  ): Promise<Payment> {
    const { orderName, originalPrice, finalPrice, orderId } = paymentInfo;

    const paymentType: PaymentProductType =
      await this.paymentsRepository.getPaymentProductType(productType);

    const paymentInputData = {
      orderId,
      orderName,
      userId,
      lecturerId,
      statusId,
      paymentProductTypeId: paymentType.id,
      originalPrice,
      finalPrice,
      paymentMethodId,
      refundableDate,
    };

    return await this.paymentsRepository.createPayment(
      transaction,
      paymentInputData,
    );
  }

  private async trxCreateUserReservation(
    transaction: PrismaTransaction,
    userId: number,
    paymentId: number,
    getLecturePaymentDto:
      | CreateLecturePaymentWithTossDto
      | CreateLecturePaymentWithPassDto
      | CreateLecturePaymentWithDepositDto,
    lectureMethod: LectureMethod,
    lectureId: number,
  ): Promise<void> {
    const { lectureSchedule, representative, phoneNumber, requests } =
      getLecturePaymentDto;

    await this.paymentsRepository.trxIncrementLectureScheduleParticipants(
      transaction,
      lectureMethod,
      lectureSchedule,
    );

    const reservationInputData: ReservationInputData = {
      lectureId,
      userId,
      paymentId,
      representative,
      phoneNumber,
      requests,
      participants: lectureSchedule.participants,
      ...(lectureMethod === LectureMethod.원데이
        ? { lectureScheduleId: lectureSchedule.lectureScheduleId }
        : { regularLectureStatusId: lectureSchedule.lectureScheduleId }),
    };

    await this.paymentsRepository.trxCreateReservation(
      transaction,
      reservationInputData,
    );
  }

  private async trxUpdateCouponUsage(
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
        couponTitle: couponData.title,
        couponPercentage: couponData.percentage,
        couponDiscountPrice: couponData.discountPrice,
        couponMaxDiscountPrice: couponData.maxDiscountPrice,
      });
    }

    if (coupons.stackableCoupon) {
      const stackableCouponData = coupons.stackableCoupon;
      Object.assign(paymentCouponUsageInputData, {
        stackableCouponId: stackableCouponData.id,
        stackableCouponTitle: stackableCouponData.title,
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
          true,
        ),
      ]);
    }
  }

  async confirmPayment(
    confirmPaymentDto: ConfirmPaymentDto,
  ): Promise<PaymentDto> {
    const { orderId, amount, paymentKey } = confirmPaymentDto;
    const paymentInfo = await this.getPaymentInfo(orderId);

    if (amount !== paymentInfo.finalPrice) {
      throw new BadRequestException(
        `결제 금액이 일치하지 않습니다.`,
        'PaymentAmountMismatch',
      );
    }

    const paymentOrderStatus = [
      PaymentOrderStatus.WAITING_FOR_DEPOSIT,
      PaymentOrderStatus.DONE,
    ];

    //입금 대기중 또는 결제 완료일때
    if (paymentOrderStatus.includes(paymentInfo.paymentStatus.id)) {
      const payment =
        await this.paymentsRepository.getLecturePaymentResultWithToss(
          paymentInfo.id,
        );

      return new PaymentDto(payment);
    }

    //결제 대기중일때
    if (paymentInfo.paymentStatus.id === PaymentOrderStatus.READY) {
      const authorizedPaymentInfo: TossPaymentsConfirmResponse =
        await this.authorizeTossPaymentApiServer({
          orderId,
          amount,
          paymentKey,
        });

      return await this.confirmPaymentTransaction(
        paymentInfo.id,
        paymentInfo.paymentProductType.name,
        paymentKey,
        authorizedPaymentInfo,
      );
    }

    throw new BadRequestException(
      `해당 결제 정보는 ${paymentInfo.paymentStatus.name}상태 입니다.`,
      'PaymentStatusMismatch',
    );
  }

  // 카드 결제 정보 처리
  private async handleCardPayment(
    transaction: PrismaTransaction,
    paymentId: number,
    paymentInfo: TossPaymentsConfirmResponse,
    productType: string,
  ): Promise<{
    paymentMethodId: PaymentMethods;
    statusId: PaymentOrderStatus;
  }> {
    if (!paymentInfo.card) {
      return;
    }

    const paymentMethodId = PaymentMethods.카드;
    const statusId = PaymentOrderStatus.DONE;

    const trxUpdateProductTarget =
      productType === PaymentProductTypes.클래스 ? 'reservation' : 'userPass';
    await this.paymentsRepository.trxUpdateProductEnabled(
      transaction,
      paymentId,
      trxUpdateProductTarget,
    );

    if (productType === PaymentProductTypes.패스권) {
      await this.trxUpdateLecturePassSalesCount(transaction, paymentId);
    }

    await this.createCardPaymentInfo(transaction, paymentId, paymentInfo.card);

    return { paymentMethodId, statusId };
  }

  // 가상계좌 결제 정보 처리
  private async handleVirtualAccountPayment(
    transaction: PrismaTransaction,
    paymentId: number,
    paymentInfo: TossPaymentsConfirmResponse,
  ): Promise<{
    paymentMethodId: PaymentMethods;
    statusId: PaymentOrderStatus;
  }> {
    if (!paymentInfo.virtualAccount) {
      return;
    }

    const paymentMethodId = PaymentMethods.가상계좌;
    const statusId = PaymentOrderStatus.WAITING_FOR_DEPOSIT;
    await this.createVirtualAccountPaymentInfo(
      transaction,
      paymentId,
      paymentInfo.virtualAccount,
    );

    return { paymentMethodId, statusId };
  }

  private async confirmPaymentTransaction(
    paymentId: number,
    productType: string,
    paymentKey: string,
    paymentInfo: TossPaymentsConfirmResponse,
  ): Promise<PaymentDto> {
    const paymentResult = await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        let paymentMethodId: number;
        let statusId: number;

        // 카드 결제 정보 처리
        const cardPaymentResult = await this.handleCardPayment(
          transaction,
          paymentId,
          paymentInfo,
          productType,
        );
        if (cardPaymentResult) {
          paymentMethodId = cardPaymentResult.paymentMethodId;
          statusId = cardPaymentResult.statusId;
        }

        // 가상계좌 결제 정보 처리
        const virtualAccountPaymentResult =
          await this.handleVirtualAccountPayment(
            transaction,
            paymentId,
            paymentInfo,
          );
        if (virtualAccountPaymentResult) {
          paymentMethodId = virtualAccountPaymentResult.paymentMethodId;
          statusId = virtualAccountPaymentResult.statusId;
        }

        // 결제 정보 업데이트
        return await this.paymentsRepository.trxUpdatePayment(
          transaction,
          paymentId,
          paymentKey,
          statusId,
          paymentMethodId,
          paymentInfo.secret,
        );
      },
    );

    return new PaymentDto(paymentResult);
  }

  private async createCardPaymentInfo(
    transaction: PrismaTransaction,
    paymentId: number,
    cardPaymentInfo: TossPaymentCardInfo,
  ) {
    const {
      issuerCode,
      acquirerCode,
      amount,
      interestPayer,
      useCardPoint,
      acquireStatus,
      ...cardData
    } = cardPaymentInfo;

    await this.validateCardCode(issuerCode);
    if (acquirerCode) {
      await this.validateCardCode(acquirerCode);
    }

    const cardPaymentInfoInputData: CardPaymentInfoInputData = {
      paymentId,
      issuerCode,
      acquirerCode,
      ...cardData,
    };

    return await this.paymentsRepository.trxCreateCardPaymentInfo(
      transaction,
      cardPaymentInfoInputData,
    );
  }

  private async validateCardCode(cardCode: string): Promise<void> {
    const selectedCard: Card = await this.paymentsRepository.getCard(cardCode);
    if (!selectedCard) {
      throw new BadRequestException(`잘못된 카드Code입니다`, 'InvalidCardCode');
    }
  }

  private async getPaymentInfo(orderId: string) {
    const paymentInfo = await this.paymentsRepository.getPaymentInfoByOrderId(
      orderId,
    );

    if (!paymentInfo) {
      throw new NotFoundException(
        `결제 정보가 존재하지 않습니다.`,
        'PaymentInfoNotFound',
      );
    }

    return paymentInfo;
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

      if (response.data.status) {
        const status =
          PaymentOrderStatus[
            response.data.status as unknown as keyof typeof PaymentOrderStatus
          ];

        if (status === PaymentOrderStatus.DONE && response.data.card !== null) {
          return { card: response.data.card };
        }
        if (
          status === PaymentOrderStatus.WAITING_FOR_DEPOSIT &&
          response.data.virtualAccount !== null
        ) {
          return {
            virtualAccount: response.data.virtualAccount,
            secret: response.data.secret,
          };
        }

        //제공되는 결제 방식이 아닐때
        await axios.post(
          `${this.tossPaymentsUrl}/${paymentInfo.paymentKey}/cancel`,
          { cancelReason: '올바르지 않은 결제 방식' },
          {
            headers: {
              Authorization: `Basic ${tossSkKey}`,
              'Content-Type': 'application/json',
            },
          },
        );
        await this.cancelPayment(paymentInfo.orderId);

        throw new BadRequestException(
          `올바르지 않은 결제 방식입니다.`,
          'InvalidPaymentMethod',
        );
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

  private async createVirtualAccountPaymentInfo(
    transaction: PrismaTransaction,
    paymentId: number,
    virtualAccountInfo: TossPaymentVirtualAccountInfo,
  ) {
    const {
      dueDate,
      bankCode,
      accountType,
      settlementStatus,
      refundStatus,
      refundReceiveAccount,
      ...virtualAccountData
    } = virtualAccountInfo;

    const convertedDueDate: Date = new Date(dueDate);
    const bank = await this.paymentsRepository.getBankInfo(bankCode);
    if (!bank) {
      throw new BadRequestException(
        `bankCode:${bankCode}인 은행 정보가 존재하지 않습니다.`,
        'BankCodeNotFound',
      );
    }
    const virtualAccountPaymentInfoInputData: VirtualAccountPaymentInfoInputData =
      {
        paymentId,
        bankCode,
        dueDate: convertedDueDate,
        ...virtualAccountData,
      };

    return await this.paymentsRepository.trxCreateVirtualAccountPaymentInfo(
      transaction,
      virtualAccountPaymentInfoInputData,
    );
  }

  async cancelPayment(orderId: string): Promise<void> {
    const paymentInfo = await this.getPaymentInfo(orderId);

    if (paymentInfo.paymentStatus.id !== PaymentOrderStatus.READY) {
      throw new BadRequestException(`취소가 불가능한 상태입니다`);
    }

    if (paymentInfo.paymentProductType.name === PaymentProductTypes.클래스) {
      return await this.trxCancelReservation(paymentInfo);
    }

    if (paymentInfo.paymentProductType.name === PaymentProductTypes.패스권) {
      return await this.trxCancelUserPass(paymentInfo);
    }
  }

  private async trxCancelReservation(
    paymentInfo: Payment & {
      paymentStatus: PaymentStatus;
      paymentCouponUsage: PaymentCouponUsage;
      paymentProductType: PaymentProductType;
      reservation: Reservation;
    },
  ) {
    const {
      id: paymentId,
      reservation,
      userId,
      lecturerId,
      paymentCouponUsage,
    } = paymentInfo;
    const couponIds: number[] = [];

    if (paymentCouponUsage) {
      paymentCouponUsage.couponId !== null &&
        couponIds.push(paymentCouponUsage.couponId);
      paymentCouponUsage.stackableCouponId !== null &&
        couponIds.push(paymentCouponUsage.stackableCouponId);
    }
    const lectureMethod = reservation.lectureScheduleId
      ? LectureMethod.원데이
      : LectureMethod.정기;

    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        await this.paymentsRepository.trxDecrementLectureScheduleParticipants(
          transaction,
          lectureMethod,
          reservation,
        );

        await this.paymentsRepository.trxDecrementLectureLearnerEnrollmentCount(
          transaction,
          userId,
          lecturerId,
        );

        if (couponIds.length) {
          await this.paymentsRepository.trxUpdateUserCouponUsage(
            transaction,
            userId,
            couponIds,
            false,
          );
        }

        await this.paymentsRepository.trxUpdatePaymentStatus(
          transaction,
          paymentId,
          PaymentOrderStatus.CANCELED,
        );
      },
    );
  }

  private async trxCancelUserPass(paymentInfo: Payment): Promise<void> {
    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        await this.paymentsRepository.trxDeleteUserPass(
          transaction,
          paymentInfo.id,
        );
        await this.paymentsRepository.trxUpdatePaymentStatus(
          transaction,
          paymentInfo.id,
          PaymentOrderStatus.CANCELED,
        );
      },
    );
  }

  async createPassPaymentWithToss(
    userId: number,
    createPassPaymentDto: CreatePassPaymentDto,
  ) {
    const pass: LecturePass = await this.checkPassValidity(
      userId,
      createPassPaymentDto.passId,
      createPassPaymentDto.finalPrice,
    );

    await this.trxCreatePassPayment(
      pass.lecturerId,
      userId,
      createPassPaymentDto,
      pass,
    );

    return {
      orderId: createPassPaymentDto.orderId,
      orderName: createPassPaymentDto.orderName,
      value: createPassPaymentDto.finalPrice,
    };
  }

  private async checkPassValidity(
    userId: number,
    passId: number,
    clientPrice: number,
  ): Promise<LecturePass> {
    const pass: LecturePass = await this.paymentsRepository.getAvailablePass(
      passId,
    );
    if (!pass) {
      throw new NotFoundException(
        `패스권 정보가 존재하지 않습니다.`,
        'PassInfoNotFound',
      );
    }
    if (pass.price !== clientPrice) {
      throw new BadRequestException(
        `상품 가격이 일치하지 않습니다.`,
        'ProductPriceMismatch',
      );
    }

    const userPass: UserPass = await this.paymentsRepository.getUserPass(
      userId,
      passId,
    );
    if (userPass) {
      throw new BadRequestException(
        `이미 구매한 패스권입니다.`,
        'AlreadyPurchasedPass',
      );
    }

    return pass;
  }

  private async trxCreatePassPayment(
    lecturerId: number,
    userId: number,
    createPassPaymentDto: CreatePassPaymentDto,
    pass: LecturePass,
  ): Promise<void> {
    const currentDate = this.getCurrentDate();
    currentDate.setDate(currentDate.getDate() + 10);

    const refundableDate = new Date(currentDate);

    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const paymentInfo: PaymentInfo =
          this.createPaymentInfo(createPassPaymentDto);

        const createdPayment: Payment = await this.trxCreatePayment(
          transaction,
          lecturerId,
          userId,
          paymentInfo,
          PaymentProductTypes.패스권,
          PaymentOrderStatus.READY,
          refundableDate,
        );

        await this.trxCreateUserPass(
          transaction,
          userId,
          pass,
          createdPayment.id,
        );
      },
    );
  }

  private async trxCreateUserPass(
    transaction: PrismaTransaction,
    userId: number,
    pass: LecturePass,
    paymentId: number,
  ): Promise<void> {
    const userPassInputData = {
      userId,
      paymentId,
      lecturePassId: pass.id,
      remainingUses: pass.maxUsageCount,
    };

    await this.paymentsRepository.trxCreateUserPass(
      transaction,
      userPassInputData,
    );
  }

  private async trxUpdateLecturePassSalesCount(
    transaction: PrismaTransaction,
    paymentId: number,
  ): Promise<void> {
    const { lecturePassId } = await this.paymentsRepository.getUserLecturePass(
      paymentId,
    );

    await this.paymentsRepository.trxUpdateLecturePassSalesCount(
      transaction,
      lecturePassId,
    );
  }

  async createLecturePaymentWithPass(
    userId,
    createLecturePaymentWithPassDto: CreateLecturePaymentWithPassDto,
  ) {
    const { passId, orderId, lectureId, lectureSchedule } =
      createLecturePaymentWithPassDto;

    //결제 완료된 상태면 결제 내역 반환
    const paymentInfo = await this.paymentsRepository.getPaymentInfoByOrderId(
      orderId,
    );
    if (
      paymentInfo &&
      paymentInfo.paymentStatus.id === PaymentOrderStatus.DONE
    ) {
      return await this.paymentsRepository.getLecturePaymentResultWithPass(
        paymentInfo.id,
      );
    }

    const { lecture, refundableDate } = await this.checkLectureValidity(
      lectureId,
      lectureSchedule,
    );
    await this.checkUserPaymentValidity(
      userId,
      createLecturePaymentWithPassDto.orderId,
    );
    const userPass: ISelectedUserPass = await this.checkUserPassValidity(
      userId,
      passId,
      lectureId,
      lectureSchedule,
    );

    const payment: Payment = await this.trxCreateLecturePaymentWithPass(
      userId,
      lecture,
      createLecturePaymentWithPassDto,
      userPass,
      refundableDate,
    );

    return await this.paymentsRepository.getLecturePaymentResultWithPass(
      payment.id,
    );
  }

  private async checkUserPassValidity(
    userId: number,
    passId: number,
    lectureId: number,
    lectureSchedule: ILectureSchedule,
  ) {
    const currentDate = this.getCurrentDate();

    const selectedPass: ISelectedUserPass =
      await this.paymentsRepository.getUserPass(userId, passId);
    if (!selectedPass) {
      throw new BadRequestException(`패스권이 존재하지 않습니다.`);
    }

    if (selectedPass.remainingUses < lectureSchedule.participants) {
      throw new BadRequestException(`패스권의 사용 가능 횟수를 초과했습니다.`);
    }

    const lectureTargetExist = selectedPass.lecturePass.lecturePassTarget.some(
      (item) => item.lectureId === lectureId,
    );
    if (!lectureTargetExist) {
      throw new BadRequestException(`패스권 적용 대상이 아닙니다.`);
    }

    if (selectedPass.endAt && selectedPass.endAt < currentDate) {
      throw new BadRequestException(`사용기간이 만료된 패스권입니다.`);
    }
    return selectedPass;
  }

  private async trxCreateLecturePaymentWithPass(
    userId: number,
    { id: lectureId, lecturerId, lectureMethodId }: Lecture,
    createLecturePaymentWithPassDto: CreateLecturePaymentWithPassDto,
    userPass: ISelectedUserPass,
    refundableDate: Date,
  ) {
    return await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const paymentInfo = this.createPaymentInfo(
          createLecturePaymentWithPassDto,
        );
        const createdLecturePayment: Payment = await this.trxCreatePayment(
          transaction,
          lecturerId,
          userId,
          paymentInfo,
          PaymentProductTypes.클래스,
          PaymentOrderStatus.DONE,
          refundableDate,
          PaymentMethods.패스권,
        );

        await Promise.all([
          (this.trxCreateUserReservation(
            transaction,
            userId,
            createdLecturePayment.id,
            createLecturePaymentWithPassDto,
            lectureMethodId,
            lectureId,
          ),
          this.trxUpdatePassUsage(
            transaction,
            createdLecturePayment.id,
            createLecturePaymentWithPassDto,
            userPass,
          )),
        ]);

        return createdLecturePayment;
      },
    );
  }

  private async trxUpdatePassUsage(
    transaction,
    paymentId: number,
    { passId, lectureSchedule }: CreateLecturePaymentWithPassDto,
    userPass: ISelectedUserPass,
  ): Promise<void> {
    await this.paymentsRepository.trxCreatePaymentPassUsage(transaction, {
      paymentId,
      lecturePassId: passId,
      usedCount: lectureSchedule.participants,
    });

    let startAt;
    let endAt;

    //패스권을 처음 사용했을때 기간 설정
    if (userPass.endAt === null) {
      startAt = new Date();
      endAt = new Date();

      endAt.setMonth(endAt.getMonth() + userPass.lecturePass.availableMonths);
    }

    await this.paymentsRepository.trxUpdateUserPassRemainingUses(
      transaction,
      userPass,
      startAt,
      endAt,
      lectureSchedule.participants,
    );
  }

  //수강생 추가 및 신청 횟수 증가
  private async trxCreateOrUpdateLectureLearner(
    transaction: PrismaTransaction,
    userId: number,
    lecturerId: number,
  ): Promise<void> {
    await this.paymentsRepository.trxUpsertLectureLearner(
      transaction,
      userId,
      lecturerId,
    );
  }

  // async createLecturePaymentWithTransfer(
  //   userId: number,
  //   dto: CreateLecturePaymentWithTransferDto,
  // ): Promise<PaymentDto> {
  //   const { lectureId, lectureSchedule, orderId, userBankAccountId } = dto;

  //   const lecture: Lecture = await this.checkLectureValidity(
  //     lectureId,
  //     lectureSchedule,
  //   );

  //   //올바른 환불 계좌인지 확인
  //   await this.checkUserBankAccount(userId, userBankAccountId);
  //   //유효한 orderId인지 확인
  //   await this.checkUserPaymentValidity(userId, orderId);
  //   //적용 가능한 쿠폰인지 확인
  //   await this.checkApplicableCoupon(dto);
  //   const coupons: Coupons = await this.comparePrice(
  //     userId,
  //     lecture.price,
  //     dto,
  //   );

  //   //계좌이체 관련 정보 생성
  //   await this.trxCreateLecturePaymentWithTransfer(
  //     userId,
  //     lecture,
  //     dto,
  //     coupons,
  //   );

  //   return new PaymentDto(
  //     await this.paymentsRepository.getUserPaymentInfo(userId, orderId),
  //   );
  // }

  private async checkUserBankAccount(
    userId: number,
    userBankAccountId: number,
  ): Promise<UserBankAccount> {
    const selectedUserBankAccount =
      await this.paymentsRepository.getUserBankAccount(
        userId,
        userBankAccountId,
      );

    if (!selectedUserBankAccount) {
      throw new BadRequestException(
        `유효하지 않은 환불 계좌 정보입니다.`,
        'InvalidRefundAccount',
      );
    }

    return selectedUserBankAccount;
  }

  // private async trxCreateLecturePaymentWithTransfer(
  //   userId: number,
  //   { id: lectureId, lecturerId, lectureMethodId },
  //   dto: CreateLecturePaymentWithTransferDto,
  //   coupons: Coupons,
  // ): Promise<void> {
  //   await this.prismaService.$transaction(
  //     async (transaction: PrismaTransaction) => {
  //       const paymentInfo = this.createPaymentInfo(dto);
  //       const createdLecturePayment: Payment = await this.trxCreatePayment(
  //         transaction,
  //         lecturerId,
  //         userId,
  //         paymentInfo,
  //         PaymentProductTypes.클래스,
  //         PaymentOrderStatus.WAITING_FOR_DEPOSIT,
  //         PaymentMethods.선결제,
  //       );

  //       await Promise.all([
  //         //계좌이체 정보 생성
  //         this.trxCreateTransferPayment(
  //           transaction,
  //           lecturerId,
  //           createdLecturePayment.id,
  //           dto.senderName,
  //           dto.userBankAccountId,
  //         ),
  //         //쿠폰 사용내역 생성
  //         this.trxUpdateCouponUsage(
  //           transaction,
  //           userId,
  //           createdLecturePayment.id,
  //           coupons,
  //         ),
  //         //예약 내역 생성
  //         this.trxCreateUserReservation(
  //           transaction,
  //           userId,
  //           createdLecturePayment.id,
  //           dto,
  //           lectureMethodId,
  //           lectureId,
  //         ),
  //         //수강생 추가 및 신청 횟수 증가
  //         this.trxCreateOrUpdateLectureLearner(transaction, userId, lecturerId),
  //       ]);
  //     },
  //   );
  // }

  // private async trxCreateTransferPayment(
  //   transaction: PrismaTransaction,
  //   lecturerId: number,
  //   paymentId: number,
  //   senderName: string,
  //   refundUserBankAccountId: number,
  //   noShowDeposit?: number,
  // ) {
  //   const lecturerBankAccount =
  //     await this.paymentsRepository.getLecturerRecentBankAccount(lecturerId);

  //   await this.paymentsRepository.trxCreateTransferPayment(transaction, {
  //     paymentId,
  //     lecturerBankAccountId: lecturerBankAccount.id,
  //     senderName,
  //     noShowDeposit,
  //   });
  //   await this.paymentsRepository.trxCreateRefundPayment(transaction, {
  //     paymentId,
  //     refundUserBankAccountId,
  //     refundStatusId: RefundStatuses.NONE,
  //   });
  // }

  // async createLecturePaymentWithDeposit(
  //   userId: number,
  //   dto: CreateLecturePaymentWithDepositDto,
  // ): Promise<PaymentDto> {
  //   const { lectureId, lectureSchedule, orderId, userBankAccountId } = dto;

  //   const lecture: Lecture = await this.checkLectureValidity(
  //     lectureId,
  //     lectureSchedule,
  //   );

  //   //올바른 환불 계좌인지 확인
  //   await this.checkUserBankAccount(userId, userBankAccountId);
  //   //유효한 orderId인지 확인
  //   await this.checkUserPaymentValidity(userId, orderId);
  //   //보증금 비교
  //   this.compareDeposit(dto, lecture);

  //   await this.trxCreateLecturePaymentWithDeposit(userId, lecture, dto);

  //   return new PaymentDto(
  //     await this.paymentsRepository.getUserPaymentInfo(userId, orderId),
  //   );
  // }

  // private compareDeposit(
  //   dto: CreateLecturePaymentWithDepositDto,
  //   lecture: Lecture,
  // ): void {
  //   const {
  //     noShowDeposit: clientDeposit,
  //     lectureSchedule,
  //     finalPrice: clientPrice,
  //   } = dto;
  //   if (
  //     (lecture.noShowDeposit && !clientDeposit) ||
  //     (!lecture.noShowDeposit && clientDeposit)
  //   ) {
  //     throw new BadRequestException(
  //       '보증금 정보가 누락되었습니다.',
  //       'DepositMissing',
  //     );
  //   } else if (lecture.noShowDeposit !== clientDeposit) {
  //     throw new BadRequestException(
  //       '보증금 가격이 일치하지 않습니다.',
  //       'DepositMismatch',
  //     );
  //   }

  //   if (clientPrice !== lecture.price * lectureSchedule.participants) {
  //     throw new BadRequestException(
  //       `상품 가격이 일치하지 않습니다.`,
  //       'ProductPriceMismatch',
  //     );
  //   }
  // }

  // private async trxCreateLecturePaymentWithDeposit(
  //   userId: number,
  //   { id: lectureId, lecturerId, lectureMethodId }: Lecture,
  //   dto:
  //     | CreateLecturePaymentWithDepositDto
  //     | CreateLecturePaymentWithDepositDto,
  // ): Promise<void> {
  //   await this.prismaService.$transaction(
  //     async (transaction: PrismaTransaction) => {
  //       const paymentInfo = {
  //         orderId: dto.orderId,
  //         orderName: dto.orderName,
  //         originalPrice: dto.originalPrice,
  //         finalPrice: dto.finalPrice,
  //         noShowDeposit: dto.noShowDeposit,
  //       };

  //       const createdLecturePayment: Payment = await this.trxCreatePayment(
  //         transaction,
  //         lecturerId,
  //         userId,
  //         paymentInfo,
  //         PaymentProductTypes.클래스,
  //         PaymentOrderStatus.WAITING_FOR_DEPOSIT,
  //         PaymentMethods.현장결제,
  //       );

  //       await Promise.all([
  //         //보증금을 포함한 계좌이체 정보 생성
  //         this.trxCreateTransferPayment(
  //           transaction,
  //           lecturerId,
  //           createdLecturePayment.id,
  //           dto.senderName,
  //           dto.userBankAccountId,
  //           dto.noShowDeposit,
  //         ),
  //         //예약 내역 생성
  //         this.trxCreateUserReservation(
  //           transaction,
  //           userId,
  //           createdLecturePayment.id,
  //           dto,
  //           lectureMethodId,
  //           lectureId,
  //         ),
  //         //수강생 추가 및 신청 횟수 증가
  //         this.trxCreateOrUpdateLectureLearner(transaction, userId, lecturerId),
  //       ]);
  //     },
  //   );
  // }

  async handleVirtualAccountPaymentStatusWebhook({
    status,
    secret,
    orderId,
  }: IWebHookData): Promise<void> {
    const selectedPayment =
      await this.paymentsRepository.getPaymentInfoByOrderId(orderId);
    // secret 키가 다르면 반환
    if (!selectedPayment) {
      return;
    }
    if (selectedPayment.secret !== secret) {
      return;
    }

    const convertedStatus =
      PaymentOrderStatus[
        status.toUpperCase() as unknown as keyof typeof PaymentOrderStatus
      ];

    // status가 다르면 반환
    if (convertedStatus !== PaymentOrderStatus.DONE) {
      return;
    }

    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const trxUpdateProductTarget =
          selectedPayment.paymentProductType.name === PaymentProductTypes.클래스
            ? 'reservation'
            : 'userPass';

        await this.paymentsRepository.trxUpdateProductEnabled(
          transaction,
          selectedPayment.id,
          trxUpdateProductTarget,
        );

        await this.paymentsRepository.trxUpdatePaymentStatus(
          transaction,
          selectedPayment.id,
          PaymentOrderStatus.DONE,
        );
      },
    );
  }

  async handleLectureRefund(
    userId: number,
    payment: Payment,
    reservation: Reservation,
    dto: HandleRefundDto,
  ): Promise<void> {
    const { cancelReason, refundAmount, userBankAccountId } = dto;
    let refundReceiveAccount: IRefundReceiveAccount;

    if (userBankAccountId) {
      refundReceiveAccount = await this.createRefundPaymentInfo(
        userId,
        userBankAccountId,
      );
    }

    const calculatedResult: ICalculatedLectureRefundResult =
      await this.calculateLectureRefundPrice(payment);
    if (calculatedResult.refundPrice !== refundAmount) {
      throw new BadRequestException(
        `환불 가격이 일치하지 않습니다.`,
        'RefundAmountMismatch',
      );
    }

    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        //원데이일때 또는 정기수업의 진행률이 0일때 수강 횟수 차감
        if (reservation.lectureScheduleId || calculatedResult.progress === 0) {
          await this.paymentsRepository.trxDecrementLectureLearnerEnrollmentCount(
            transaction,
            userId,
            payment.lecturerId,
          );
        }

        await Promise.all([
          this.paymentsRepository.trxDecrementLectureScheduleParticipants(
            transaction,
            reservation.lectureScheduleId
              ? LectureMethod.원데이
              : LectureMethod.정기,
            reservation,
          ),

          this.paymentsRepository.trxUpdatePaymentStatus(
            transaction,
            payment.id,
            PaymentOrderStatus.CANCELED,
          ),

          this.paymentsRepository.trxUpdateReservationStatus(
            transaction,
            reservation.id,
            false,
          ),

          this.paymentsRepository.trxCreateRefundPayment(transaction, {
            paymentId: payment.id,
            refundUserBankAccountId: userBankAccountId,
            refundStatusId: RefundStatuses.COMPLETED,
            cancelAmount: calculatedResult.refundPrice,
            cancelReason,
          }),

          this.refundTossPaymentApiServer(payment, {
            cancelReason,
            cancelAmount: calculatedResult.refundPrice,
            refundReceiveAccount,
          }),
        ]);
      },
    );
  }

  /**
   * 결제를 취소한 시간이 cancellationAbsoluteTime에서 지정한 시간 이내일때 전액 환불
   * 결제 취소 시간이 refundableTimePeriod에서 지정한 유예 시간 이내일때 전액 환불
   * 원데이일때 위 경우를 제외하면 환불 X
   *
   * 정기일때 위 예시X 일때
   * 진행도 50% 이하일때 환불가격 = 총 가격 * (수강한 횟수/전체 횟수)
   * 50% 이상일때 환불X
   *
   */

  private async calculateLectureRefundPrice(
    payment: Payment,
  ): Promise<ICalculatedLectureRefundResult> {
    const currentDate = this.getCurrentDate();
    const elapsedMilliseconds =
      currentDate.getTime() - payment.updatedAt.getTime();

    //결제를 취소한 시간이 cancellationAbsoluteTime에서 지정한 시간 이내일때 전액 환불
    //결제 취소 시간이 refundableTimePeriod에서 지정한 유예 시간 이내일때 전액 환불
    //만약 정규강의가 중도 참여가 가능하다면 아래 로직은 변경되어야함
    if (
      this.cancellationAbsoluteTime >= elapsedMilliseconds ||
      payment.refundableDate >= currentDate
    ) {
      return { refundPrice: payment.finalPrice };
    }

    const selectedReservation =
      await this.paymentsRepository.getUserReservationWithSchedule(payment.id);
    if (!selectedReservation) {
      throw new BadRequestException(
        `올바르지 않은 예약 정보입니다.`,
        'InvalidReservationInformation',
      );
    }

    const { lectureSchedule, regularLectureStatus } = selectedReservation;

    if (lectureSchedule) {
      throw new BadRequestException(
        `환불 가능 기간이 아닙니다.`,
        'RefundPeriodNotAvailable',
      );
    }
    if (regularLectureStatus) {
      const totalSessions = regularLectureStatus.regularLectureSchedule.length;
      const attendedSessions =
        regularLectureStatus.regularLectureSchedule.filter(
          (schedule) =>
            schedule.startDateTime.getTime() <= currentDate.getTime(),
        ).length;
      const remainingSessions = totalSessions - attendedSessions;

      const progress = (attendedSessions / totalSessions) * 100;

      if (progress <= 50) {
        // 진행도 50% 이하일때 환불가격 = 총 가격 * (남은 횟수/전체 횟수)
        const refundPrice =
          payment.finalPrice * (remainingSessions / totalSessions);
        return { refundPrice, progress };
      } else {
        // 50% 이상일때 환불X
        throw new BadRequestException(
          `환불 가능 기간이 아닙니다.`,
          'RefundPeriodNotAvailable',
        );
      }
    }
  }

  private getCurrentDate(): Date {
    const date = new Date();
    return new Date(date.getTime() + 9 * this.oneHour);
  }

  private async refundTossPaymentApiServer(
    payment: Payment,
    paymentInfo: IRefundPaymentInfo,
  ) {
    try {
      const tossSkKey = Buffer.from(`${this.tossPaymentsSecretKey}:`).toString(
        'base64',
      );

      await axios.post(
        `${this.tossPaymentsUrl}/${payment.paymentKey}/cancel`,
        paymentInfo,
        {
          headers: {
            Authorization: `Basic ${tossSkKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
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

  private async createRefundPaymentInfo(
    userId: number,
    userBankAccountId: number,
  ): Promise<IRefundReceiveAccount> {
    const userRefundBankAccount: UserBankAccount =
      await this.checkUserBankAccount(userId, userBankAccountId);

    return {
      bank: userRefundBankAccount.bankCode,
      holderName: userRefundBankAccount.holderName,
      accountNumber: userRefundBankAccount.accountNumber,
    };
  }

  async getUserPaymentForRefund(userId: number, paymentId: number) {
    const selectedPayment =
      await this.paymentsRepository.getUserPaymentInfoById(userId, paymentId);

    if (!selectedPayment) {
      throw new BadRequestException(
        `잘못된 결제 정보입니다.`,
        'InvalidPaymentInformation',
      );
    }

    if (selectedPayment.paymentMethodId === PaymentMethods.패스권) {
      throw new BadRequestException(
        `패스권으로 결제한 강의는 환불할 수 없습니다.`,
        'CannotRefundLectureWithPass',
      );
    }

    if (selectedPayment.statusId === PaymentOrderStatus.CANCELED) {
      throw new BadRequestException(
        `이미 환불 처리된 결제 정보입니다.`,
        'AlreadyRefunded',
      );
    }

    if (selectedPayment.statusId !== PaymentOrderStatus.DONE) {
      throw new BadRequestException(
        `해당 결제 정보는 결제가 완료되지 않은 결제 정보입니다.`,
        'PaymentNotCompleted',
      );
    }

    return selectedPayment;
  }
}
