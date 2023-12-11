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
  LectureSchedule,
  PaymentInfo,
  ReservationInputData,
  TossPaymentCardInfo,
  TossPaymentVirtualAccountInfo,
  TossPaymentsConfirmResponse,
  VirtualAccountPaymentInfoInputData,
} from '@src/payments/interface/payments.interface';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  Card,
  Lecture,
  LecturePass,
  Payment,
  PaymentProductType,
} from '@prisma/client';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import { ConfirmLecturePaymentDto as ConfirmPaymentDto } from '@src/payments/dtos/confirm-lecture-payment.dto';
import {
  PaymentMethods,
  PaymentProductTypes,
  PaymentOrderStatus,
  VirtualAccountRefundStatus,
} from '@src/payments/enum/payment.enum';
import axios from 'axios';
import { CreatePassPaymentDto } from '@src/payments/dtos/create-pass-payment.dto';
import { CreateLecturePaymentWithPassDto } from '@src/payments/dtos/create-lecture-payment-with-pass.dto';

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

  async createLecturePaymentWithToss(
    userId: number,
    createLecturePaymentDto: CreateLecturePaymentWithTossDto,
  ) {
    const { lectureId, lectureSchedules } = createLecturePaymentDto;
    const lecture: Lecture = await this.checkLectureValidity(
      lectureId,
      lectureSchedules,
    );

    await this.checkUserPaymentValidity(
      userId,
      createLecturePaymentDto.orderId,
    );
    await this.checkApplicableCoupon(createLecturePaymentDto);

    // 강의 자리수 확인 및 쿠폰 비교
    const coupons: Coupons = await this.comparePrice(
      userId,
      lecture.price,
      createLecturePaymentDto,
    );

    await this.trxCreateLecturePaymentWithToss(
      userId,
      lecture.lecturerId,
      createLecturePaymentDto,
      coupons,
    );

    const lecturePaymentInfo = {
      orderId: createLecturePaymentDto.orderId,
      orderName: createLecturePaymentDto.orderName,
      value: createLecturePaymentDto.finalPrice,
    };

    return lecturePaymentInfo;
  }

  private async trxCreateLecturePaymentWithToss(
    userId: number,
    lecturerId: number,
    createLecturePaymentDto: CreateLecturePaymentWithTossDto,
    coupons: Coupons,
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
          ),
          this.trxCreateOrUpdateLectureLearner(
            transaction,
            userId,
            lecturerId,
            createLecturePaymentDto.lectureSchedules.length,
          ),
        ]);
      },
    );
  }

  private async checkLectureValidity(
    lectureId: number,
    lectureSchedules: LectureSchedule[],
  ): Promise<Lecture> {
    const lecture: Lecture = await this.paymentsRepository.getLecture(
      lectureId,
    );
    if (!lecture) {
      throw new NotFoundException(`강의정보가 존재하지 않습니다.`);
    }
    if (!lecture.isActive) {
      throw new BadRequestException(`활성화되지 않은 강의입니다.`);
    }

    //강의 인원수 확인
    await this.checkLectureSchedules(lecture.maxCapacity, lectureSchedules);

    return lecture;
  }

  private async checkUserPaymentValidity(userId, orderId): Promise<void> {
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
    lecturePrice: number,
    {
      couponId,
      stackableCouponId,
      finalPrice: clientPrice,
      lectureSchedules,
    }: CreateLecturePaymentWithTossDto,
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
      throw new BadRequestException(
        `상품 가격이 일치하지 않습니다.`,
        'ProductPriceMismatch',
      );
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
      | CreateLecturePaymentWithPassDto,
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
      | CreateLecturePaymentWithPassDto,
  ): Promise<void> {
    const { lectureSchedules, representative, phoneNumber, requests } =
      getLecturePaymentDto;

    for (const lectureSchedule of lectureSchedules) {
      await this.paymentsRepository.trxIncrementLectureScheduleParticipants(
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
        ),
      ]);
    }
  }

  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto) {
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

    if (paymentOrderStatus.includes(paymentInfo.paymentStatus.id)) {
      return await this.paymentsRepository.getLecturePaymentResultWithToss(
        paymentInfo.id,
      );
    }

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

  private async confirmPaymentTransaction(
    paymentId: number,
    productType: string,
    paymentKey: string,
    paymentInfo: TossPaymentsConfirmResponse,
  ): Promise<IPaymentResult> {
    const paymentResult: IPaymentResult = await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        let paymentMethodId: number;
        let statusId: number;

        if (paymentInfo.card) {
          paymentMethodId = PaymentMethods.카드;
          statusId = PaymentOrderStatus.DONE;
          const target =
            productType === PaymentProductTypes.클래스
              ? 'reservation'
              : 'userPass';

          await this.paymentsRepository.trxUpdateProductEnabled(
            transaction,
            paymentId,
            target,
          );

          if (productType === PaymentProductTypes.패스권) {
            await this.trxUpdateLecturePassSalesCount(transaction, paymentId);
          }

          await this.createCardPaymentInfo(
            transaction,
            paymentId,
            paymentInfo.card,
          );
        }
        if (paymentInfo.virtualAccount) {
          paymentMethodId = PaymentMethods.가상계좌;
          statusId = PaymentOrderStatus.WAITING_FOR_DEPOSIT;

          await this.createVirtualAccountPaymentInfo(
            transaction,
            paymentId,
            paymentInfo.virtualAccount,
          );
        }

        return await this.paymentsRepository.trxUpdatePayment(
          transaction,
          paymentId,
          paymentKey,
          statusId,
          paymentMethodId,
        );
      },
    );

    return paymentResult;
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
    const paymentInfo = await this.paymentsRepository.getPaymentInfo(orderId);

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
        if (status === PaymentOrderStatus.DONE && response.data.card) {
          return { card: response.data.card };
        }
        if (
          status === PaymentOrderStatus.WAITING_FOR_DEPOSIT &&
          response.data.virtualAccount
        ) {
          return { virtualAccount: response.data.virtualAccount };
        }
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
        refundStatusId: VirtualAccountRefundStatus.NONE,
        bankCode,
        dueDate: convertedDueDate,
        ...virtualAccountData,
      };

    return await this.paymentsRepository.trxCreateVirtualAccountPaymentInfo(
      transaction,
      virtualAccountPaymentInfoInputData,
    );
  }

  async getUserReceipt(userId: number, orderId: string) {
    const receipt = await this.paymentsRepository.getUserReceipt(
      userId,
      orderId,
    );
    if (!receipt) {
      throw new NotFoundException(
        `결제정보가 존재하지 않습니다.`,
        `NotFoundPaymentInfo`,
      );
    }

    return receipt;
  }

  async cancelPayment(orderId: string): Promise<void> {
    const paymentInfo = await this.getPaymentInfo(orderId);

    if (paymentInfo.paymentStatus.id !== PaymentOrderStatus.READY) {
      throw new BadRequestException(`취소가 불가능한 상태입니다`);
    }

    if (paymentInfo.paymentProductType.name === PaymentProductTypes.클래스) {
      await this.cancelReservationTransaction(paymentInfo);
    }
  }

  private async cancelReservationTransaction(paymentInfo) {
    const { id: paymentId, reservation: reservations } = paymentInfo;

    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        for (const reservation of reservations) {
          await this.paymentsRepository.trxDecrementLectureScheduleParticipants(
            transaction,
            reservation,
          );
        }
        await this.paymentsRepository.trxUpdateLecturePaymentStatus(
          transaction,
          paymentId,
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

  private async checkPassValidity(passId: number, clientPrice: number) {
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
    return pass;
  }

  private async trxCreatePassPayment(
    lecturerId: number,
    userId: number,
    createPassPaymentDto: CreatePassPaymentDto,
    pass: LecturePass,
  ): Promise<void> {
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
    const { passId, orderId, lectureId, lectureSchedules } =
      createLecturePaymentWithPassDto;

    //결제 완료된 상태면 결제 내역 반환
    const paymentInfo = await this.paymentsRepository.getPaymentInfo(orderId);
    if (
      paymentInfo &&
      paymentInfo.paymentStatus.id === PaymentOrderStatus.DONE
    ) {
      return await this.paymentsRepository.getLecturePaymentResultWithPass(
        paymentInfo.id,
      );
    }

    const lecture = await this.checkLectureValidity(
      lectureId,
      lectureSchedules,
    );
    await this.checkUserPaymentValidity(
      userId,
      createLecturePaymentWithPassDto.orderId,
    );
    const userPass: ISelectedUserPass = await this.checkUserPassValidity(
      userId,
      passId,
      lectureId,
      lectureSchedules,
    );

    const payment: Payment = await this.trxCreateLecturePaymentWithPass(
      userId,
      lecture.lecturerId,
      createLecturePaymentWithPassDto,
      userPass,
    );

    return await this.paymentsRepository.getLecturePaymentResultWithPass(
      payment.id,
    );
  }

  private async checkUserPassValidity(
    userId: number,
    passId: number,
    lectureId: number,
    lectureSchedules: LectureSchedule[],
  ) {
    const totalParticipants = lectureSchedules.reduce(
      (total, item) => total + item.participants,
      0,
    );

    const currentDate = new Date();

    const selectedPass: ISelectedUserPass =
      await this.paymentsRepository.getUserPass(userId, passId);
    if (!selectedPass) {
      throw new BadRequestException(`패스권이 존재하지 않습니다.`);
    }

    if (selectedPass.remainingUses < totalParticipants) {
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
    lecturerId: number,
    createLecturePaymentWithPassDto: CreateLecturePaymentWithPassDto,
    userPass: ISelectedUserPass,
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
          PaymentMethods.패스권,
        );

        await Promise.all([
          (this.trxCreateUserReservation(
            transaction,
            userId,
            createdLecturePayment.id,
            createLecturePaymentWithPassDto,
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
    { passId, lectureSchedules }: CreateLecturePaymentWithPassDto,
    userPass: ISelectedUserPass,
  ): Promise<void> {
    const totalParticipants: number = lectureSchedules.reduce(
      (total, item) => total + item.participants,
      0,
    );

    await this.paymentsRepository.trxCreatePaymentPassUsage(transaction, {
      paymentId,
      lecturePassId: passId,
      usedCount: totalParticipants,
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
      totalParticipants,
    );
  }

  private async trxCreateOrUpdateLectureLearner(
    transaction: PrismaTransaction,
    userId: number,
    lecturerId: number,
    enrollmentCount: number,
  ): Promise<void> {
    await this.paymentsRepository.trxUpsertLectureLearner(
      transaction,
      userId,
      lecturerId,
      enrollmentCount,
    );
  }
}
