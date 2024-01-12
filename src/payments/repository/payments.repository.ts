import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  CardPaymentInfoInputData,
  ICursor,
  ILecturerBankAccountInputData,
  IPaymentPassUsageInputData,
  ISelectedUserPass,
  IUserBankAccountInputData,
  LectureCoupon,
  LectureCouponUseage,
  LecturePaymentUpdateData,
  ILectureSchedule,
  PaymentInputData,
  ReservationInputData,
  UserPassInputData,
  VirtualAccountPaymentInfoInputData,
  ITransferPaymentInputData,
  IRefundPaymentInputData,
  IRefundPaymentUpdateData,
  IPayment,
} from '@src/payments/interface/payments.interface';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import {
  PaymentOrderStatus,
  PaymentMethods,
  PaymentProductTypes,
} from '@src/payments/enum/payment.enum';
import {
  Lecture,
  LecturePass,
  LecturerBankAccount,
  LecturerLearner,
  Payment,
  PaymentProductType,
  PaymentStatus,
  UserBankAccount,
} from '@prisma/client';
import { PaymentProductTypeDto } from '../dtos/payment-product-type.dto';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserCoupon(
    userId,
    lectureCouponId,
    isStackable,
  ): Promise<LectureCoupon> {
    try {
      const currentDate = new Date();

      return await this.prismaService.userCoupon.findFirst({
        where: {
          userId,
          lectureCouponId,
          isUsed: false,
          lectureCoupon: {
            isStackable,
            isDisabled: false,
            endAt: {
              gte: currentDate,
            },
          },
        },
        select: {
          lectureCoupon: {
            select: {
              id: true,
              title: true,
              percentage: true,
              discountPrice: true,
              maxDiscountPrice: true,
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 유저 쿠폰 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async getLectureCouponTarget(
    lectureId: number,
    couponIds: number[],
  ): Promise<LectureCouponUseage[]> {
    try {
      return await this.prismaService.lectureCouponTarget.findMany({
        where: {
          lectureId,
          lectureCouponId: {
            in: couponIds,
          },
        },
        select: {
          lectureCoupon: {
            select: {
              maxUsageCount: true,
              usageCount: true,
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async getLecture(lectureId) {
    try {
      return await this.prismaService.lecture.findUnique({
        where: { id: lectureId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 강의 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }
  async getUserLecturePayment(userId: number, orderId: string) {
    try {
      return await this.prismaService.payment.findFirst({
        where: { userId, orderId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 결제 정보 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async getLectureSchedule(lectureScheduleId: number) {
    try {
      return await this.prismaService.lectureSchedule.findFirst({
        where: {
          id: lectureScheduleId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 강의 일정 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async getPaymentMethod(id: number) {
    try {
      return await this.prismaService.paymentMethod.findFirstOrThrow({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 결제 방식 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async getPaymentStatus(id: number): Promise<PaymentStatus> {
    try {
      return await this.prismaService.paymentStatus.findFirstOrThrow({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 결제 상태 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async createPayment(
    transaction: PrismaTransaction,
    paymentInputData: PaymentInputData,
  ): Promise<Payment> {
    try {
      return await transaction.payment.create({
        data: paymentInputData,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          `주문Id가 중복되었습니다.`,
          'DuplicateOrderId',
        );
      }

      throw new InternalServerErrorException(
        `Prisma 결제 정보 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }

  async trxIncrementLectureScheduleParticipants(
    transaction: PrismaTransaction,
    lectureSchedule: ILectureSchedule,
  ) {
    try {
      await transaction.lectureSchedule.update({
        where: { id: lectureSchedule.lectureScheduleId },
        data: {
          numberOfParticipants: {
            increment: lectureSchedule.participants,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 강의 일정 수정 실패: ${error}`,
        'PrismaUpdateFailed',
      );
    }
  }

  async trxCreateReservation(
    transaction: PrismaTransaction,
    reservationInputData: ReservationInputData,
  ) {
    try {
      await transaction.reservation.create({ data: reservationInputData });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 예약 정보 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }

  async trxUpdateLectureCouponUseage(
    transaction: PrismaTransaction,
    couponIds: number[],
  ) {
    try {
      await transaction.lectureCoupon.updateMany({
        where: { id: { in: couponIds } },
        data: {
          usageCount: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 사용량 수정 실패: ${error}`,
        'PrismaUpdateFailed',
      );
    }
  }

  async trxCreatePaymentCouponUsage(
    transaction: PrismaTransaction,
    paymentCouponUsageInputData,
  ) {
    try {
      await transaction.paymentCouponUsage.create({
        data: paymentCouponUsageInputData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 사용내역 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }

  async trxUpdateUserCouponUsage(
    transaction: PrismaTransaction,
    userId: number,
    couponIds: number[],
    isUsed: boolean,
  ) {
    try {
      await transaction.userCoupon.updateMany({
        where: { userId, lectureCouponId: { in: couponIds } },
        data: { isUsed },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 유저 쿠폰 사용여부 수정 실패: ${error}`,
        'PrismaUpdateFailed',
      );
    }
  }

  async getPaymentInfo(orderId: string) {
    try {
      return await this.prismaService.payment.findUnique({
        where: { orderId },
        select: {
          id: true,
          orderId: true,
          originalPrice: true,
          finalPrice: true,
          lecturerId: true,
          userId: true,
          paymentProductType: { select: { id: true, name: true } },
          paymentStatus: {
            select: {
              id: true,
              name: true,
            },
          },
          reservation: {
            select: {
              id: true,
              participants: true,
              lectureScheduleId: true,
            },
          },
          paymentCouponUsage: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 결제정보 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async updateLecturePayment(
    orderId: string,
    updateData: LecturePaymentUpdateData,
  ) {
    try {
      return await this.prismaService.payment.update({
        where: { orderId },
        data: updateData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 결제 정보 수정 실패: ${error}`,
        'PrismaUpdateFailed',
      );
    }
  }

  async trxUpdatePayment(
    transaction: PrismaTransaction,
    paymentId: number,
    paymentKey: string,
    statusId: number,
    paymentMethodId: number,
  ) {
    try {
      return await transaction.payment.update({
        where: { id: paymentId },
        data: { paymentKey, statusId, paymentMethodId },
        select: {
          orderId: true,
          orderName: true,
          originalPrice: true,
          finalPrice: true,
          paymentProductType: {
            select: {
              name: true,
            },
          },
          paymentMethod: {
            select: {
              name: true,
            },
          },
          createdAt: true,
          updatedAt: true,
          reservation: {
            select: {
              participants: true,
              requests: true,
              lectureSchedule: {
                select: {
                  lectureId: true,
                  startDateTime: true,
                },
              },
            },
          },
          userPass: {
            select: {
              lecturePass: {
                select: {
                  id: true,
                  title: true,
                  maxUsageCount: true,
                  availableMonths: true,
                },
              },
            },
          },
          cardPaymentInfo: {
            select: {
              number: true,
              installmentPlanMonths: true,
              approveNo: true,
            },
          },
          virtualAccountPaymentInfo: {
            select: {
              accountNumber: true,
              customerName: true,
              dueDate: true,
              bank: {
                select: {
                  code: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 결제 정보 수정 실패: ${error}`,
        'PrismaUpdateFailed',
      );
    }
  }

  async getPaymentProductType(
    productType: string,
  ): Promise<PaymentProductType> {
    try {
      return this.prismaService.paymentProductType.findFirst({
        where: { name: productType },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 상품 타입 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async getCard(code: string) {
    try {
      return this.prismaService.card.findUnique({ where: { code } });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 카드 정보 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async trxCreateCardPaymentInfo(
    transaction: PrismaTransaction,
    cardPaymentInfoInputData: CardPaymentInfoInputData,
  ) {
    try {
      return await transaction.cardPaymentInfo.create({
        data: cardPaymentInfoInputData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 카드 결제정보 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }

  async getBankInfo(code: string) {
    try {
      return await this.prismaService.bank.findUnique({ where: { code } });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 은행 정보 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async trxCreateVirtualAccountPaymentInfo(
    transaction: PrismaTransaction,
    virtualAccountPaymentInfoInputData: VirtualAccountPaymentInfoInputData,
  ) {
    try {
      return await transaction.virtualAccountPaymentInfo.create({
        data: virtualAccountPaymentInfoInputData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 가상계좌 결제 정보 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }

  async getUserReceipt(userId, orderId) {
    return await this.prismaService.payment.findFirst({
      where: { orderId, userId },
      select: {
        orderId: true,
        orderName: true,
        originalPrice: true,
        finalPrice: true,
        paymentProductType: {
          select: {
            name: true,
          },
        },
        paymentMethod: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        cardPaymentInfo: {
          select: {
            number: true,
            installmentPlanMonths: true,
            approveNo: true,
            issuer: {
              select: {
                code: true,
                name: true,
              },
            },
            acquirer: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
        virtualAccountPaymentInfo: {
          select: {
            accountNumber: true,
            customerName: true,
            dueDate: true,
            bank: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
        paymentCouponUsage: {
          select: {
            couponTitle: true,
            couponDiscountPrice: true,
            couponMaxDiscountPrice: true,
            couponPercentage: true,
            stackableCouponTitle: true,
            stackableCouponPercentage: true,
            stackableCouponDiscountPrice: true,
            stackableCouponMaxDiscountPrice: true,
          },
        },
        paymentPassUsage: {
          select: {
            usedCount: true,
            lecturePass: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });
  }

  async getLecturePaymentResultWithToss(paymentId: number) {
    try {
      return await this.prismaService.payment.findUnique({
        where: { id: paymentId },
        select: {
          orderId: true,
          orderName: true,
          originalPrice: true,
          finalPrice: true,
          paymentProductType: {
            select: {
              name: true,
            },
          },
          paymentMethod: {
            select: {
              name: true,
            },
          },
          createdAt: true,
          updatedAt: true,
          reservation: {
            select: {
              participants: true,
              lectureSchedule: {
                select: {
                  lectureId: true,
                  startDateTime: true,
                },
              },
            },
          },
          userPass: {
            select: {
              lecturePass: {
                select: {
                  id: true,
                  title: true,
                  maxUsageCount: true,
                  availableMonths: true,
                },
              },
            },
          },
          cardPaymentInfo: {
            select: {
              number: true,
              installmentPlanMonths: true,
              approveNo: true,
            },
          },
          virtualAccountPaymentInfo: {
            select: {
              accountNumber: true,
              customerName: true,
              dueDate: true,
              bank: {
                select: {
                  code: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 결제 정보 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async getLecturePaymentResultWithPass(paymentId: number) {
    try {
      return await this.prismaService.payment.findUnique({
        where: { id: paymentId },
        select: {
          orderId: true,
          orderName: true,
          originalPrice: true,
          finalPrice: true,
          paymentProductType: {
            select: {
              name: true,
            },
          },
          paymentMethod: {
            select: {
              name: true,
            },
          },
          createdAt: true,
          updatedAt: true,
          paymentPassUsage: {
            select: {
              usedCount: true,
              lecturePass: {
                select: {
                  title: true,
                },
              },
            },
          },
          reservation: {
            select: {
              participants: true,
              requests: true,
              lectureSchedule: {
                select: {
                  lectureId: true,
                  startDateTime: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 결제 정보 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async trxDecrementLectureScheduleParticipants(
    transaction: PrismaTransaction,
    reservation: ILectureSchedule,
  ) {
    try {
      await transaction.lectureSchedule.update({
        where: { id: reservation.lectureScheduleId },
        data: {
          numberOfParticipants: {
            decrement: reservation.participants,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 강의 일정 수정 실패: ${error}`,
        'PrismaUpdateFailed',
      );
    }
  }

  async trxUpdateLecturePaymentStatus(
    transaction: PrismaTransaction,
    paymentId: number,
    statusId: number,
  ) {
    try {
      await transaction.payment.update({
        where: { id: paymentId },
        data: { statusId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 결제 정보 수정 실패: ${error}`,
        'PrismaUpdateFailed',
      );
    }
  }

  async countUserPaymentsHistory(
    userId: number,
    paymentProductTypeId: number,
  ): Promise<number> {
    return await this.prismaService.payment.count({
      where: { userId, paymentProductTypeId },
    });
  }

  async getUserPaymentHistory(
    userId: number,
    take: number,
    paymentProductTypeId: number | undefined,
    cursor?: ICursor,
    skip?: number,
  ) {
    try {
      return await this.prismaService.payment.findMany({
        where: { userId, paymentProductTypeId },
        take,
        skip,
        cursor,
        select: {
          id: true,
          orderId: true,
          orderName: true,
          originalPrice: true,
          finalPrice: true,
          paymentProductType: {
            select: {
              name: true,
            },
          },
          paymentMethod: {
            select: {
              name: true,
            },
          },
          paymentStatus: {
            select: {
              name: true,
            },
          },
          updatedAt: true,
          reservation: {
            select: {
              participants: true,
              lectureSchedule: {
                select: {
                  startDateTime: true,
                  lecture: {
                    select: {
                      id: true,
                      lectureImage: { select: { imageUrl: true }, take: 1 },
                    },
                  },
                },
              },
            },
          },
          userPass: {
            select: {
              lecturePass: {
                select: {
                  id: true,
                  title: true,
                  maxUsageCount: true,
                  availableMonths: true,
                },
              },
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 결제 정보 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async getPaymentVirtualAccount(userId: number, paymentId: number) {
    try {
      return await this.prismaService.payment.findFirst({
        where: {
          id: paymentId,
          userId,
          paymentMethodId: PaymentMethods.가상계좌,
        },
        select: {
          originalPrice: true,
          finalPrice: true,
          virtualAccountPaymentInfo: {
            select: {
              accountNumber: true,
              customerName: true,
              dueDate: true,
              bank: {
                select: {
                  code: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 결제 정보 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }
  async getAvailablePass(passId: number): Promise<LecturePass> {
    try {
      return this.prismaService.lecturePass.findUnique({
        where: { id: passId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 패스권 정보 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }
  async trxCreateUserPass(
    transaction: PrismaTransaction,
    userPassInputData: UserPassInputData,
  ): Promise<void> {
    try {
      await transaction.userPass.create({ data: userPassInputData });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 유저 패스권 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }
  async trxUpdateProductEnabled(
    transaction: PrismaTransaction,
    paymentId: number,
    target: string,
  ) {
    try {
      return await transaction[target].updateMany({
        where: { paymentId },
        data: { isEnabled: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 타겟 데이터 수정 실패: ${error}`,
        'PrismaUpdateFailed',
      );
    }
  }

  async getUserLecturePass(paymentId: number): Promise<{ lecturePassId }> {
    try {
      return await this.prismaService.userPass.findUnique({
        where: { paymentId },
        select: { lecturePassId: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 유저 패스권 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async trxUpdateLecturePassSalesCount(
    transaction: PrismaTransaction,
    lecturePassId: number,
  ): Promise<void> {
    try {
      await transaction.lecturePass.update({
        where: { id: lecturePassId },
        data: {
          salesCount: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 패스권 수정 실패: ${error}`,
        'PrismaUpdateFailed',
      );
    }
  }
  async getUserPass(userId: number, passId: number) {
    try {
      return await this.prismaService.userPass.findFirst({
        where: {
          userId,
          lecturePassId: passId,
          isEnabled: true,
        },
        include: {
          lecturePass: {
            select: {
              availableMonths: true,
              lecturePassTarget: { select: { lectureId: true } },
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 유저 패스권 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async trxCreatePaymentPassUsage(
    transaction: PrismaTransaction,
    data: IPaymentPassUsageInputData,
  ) {
    try {
      await transaction.paymentPassUsage.create({ data });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 패스권 사용내역 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }

  async trxUpdateUserPassRemainingUses(
    transaction: PrismaTransaction,
    userPass: ISelectedUserPass,
    startAt: Date,
    endAt: Date,
    totalParticipants: number,
  ) {
    try {
      await transaction.userPass.update({
        where: { id: userPass.id },
        data: {
          startAt,
          endAt,
          remainingUses: { decrement: totalParticipants },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 패스권 사용내역 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }

  async getLectureLearner(
    userId: number,
    lecturerId: number,
  ): Promise<LecturerLearner> {
    try {
      return await this.prismaService.lecturerLearner.findFirst({
        where: { userId, lecturerId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 수강생 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async trxUpsertLectureLearner(
    transaction: PrismaTransaction,
    userId: number,
    lecturerId: number,
    enrollmentCount: number,
  ): Promise<void> {
    try {
      await transaction.lecturerLearner.upsert({
        where: { userId_lecturerId: { userId, lecturerId } },
        create: { userId, lecturerId, enrollmentCount },
        update: { enrollmentCount: { increment: enrollmentCount } },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 수강생 생성/수정 실패: ${error}`,
        'PrismaUpsertFailed',
      );
    }
  }

  async trxUpdateReservationEnabled(
    transaction: PrismaTransaction,
    paymentId: number,
    isEnabled: boolean,
  ) {
    await transaction.reservation.updateMany({
      where: { paymentId },
      data: { isEnabled },
    });
  }

  async trxDecrementLectureLearner(
    transaction: PrismaTransaction,
    userId: number,
    lecturerId: number,
    enrollmentCount: number,
  ) {
    await transaction.lecturerLearner.update({
      where: { userId_lecturerId: { userId, lecturerId } },
      data: { enrollmentCount: { decrement: enrollmentCount } },
    });
  }

  async createUserBankAccount(
    userBankAccountInputData: IUserBankAccountInputData,
  ): Promise<UserBankAccount> {
    return await this.prismaService.userBankAccount.upsert({
      where: {
        userId_holderName_bankCode_accountNumber: userBankAccountInputData,
      },
      update: userBankAccountInputData,
      create: userBankAccountInputData,
    });
  }

  async getUserRecentBankAccount(userId: number): Promise<UserBankAccount> {
    return await this.prismaService.userBankAccount.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async createLecturerBankAccount(
    lecturerBankAccountInputData: ILecturerBankAccountInputData,
  ): Promise<LecturerBankAccount> {
    return await this.prismaService.lecturerBankAccount.upsert({
      where: {
        lecturerId_holderName_bankCode_accountNumber:
          lecturerBankAccountInputData,
      },
      update: lecturerBankAccountInputData,
      create: lecturerBankAccountInputData,
    });
  }

  async getLecturerRecentBankAccount(
    lecturerId: number,
  ): Promise<LecturerBankAccount> {
    return await this.prismaService.lecturerBankAccount.findFirst({
      where: { lecturerId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getUserBankAccount(userId: number, userBankAccountId: number) {
    return await this.prismaService.userBankAccount.findFirst({
      where: { id: userBankAccountId, userId },
    });
  }

  async trxCreateTransferPayment(
    transaction: PrismaTransaction,
    transferPaymentInputData: ITransferPaymentInputData,
  ) {
    await transaction.transferPaymentInfo.create({
      data: transferPaymentInputData,
    });
  }

  async trxCreateRefundPayment(
    transaction: PrismaTransaction,
    refundPaymentInputData: IRefundPaymentInputData,
  ) {
    await transaction.refundPaymentInfo.create({
      data: refundPaymentInputData,
    });
  }

  async getUserPaymentInfo(userId: number, orderId: string) {
    return await this.prismaService.payment.findFirst({
      where: { userId, orderId },
      include: {
        paymentProductType: true,
        paymentStatus: true,
        paymentMethod: true,
        paymentCouponUsage: true,
        transferPaymentInfo: { include: { lecturerBankAccount: true } },
        refundPaymentInfo: {
          include: { refundStatus: true, refundUserBankAccount: true },
        },
        reservation: {
          include: { lectureSchedule: { include: { lecture: true } } },
        },
        cardPaymentInfo: { include: { issuer: true, acquirer: true } },
        virtualAccountPaymentInfo: { include: { bank: true } },
        paymentPassUsage: { include: { lecturePass: true } },
      },
    });
  }

  async getLecturerLectureList(lecturerId: number): Promise<Lecture[]> {
    return await this.prismaService.lecture.findMany({ where: { lecturerId } });
  }

  async getPaymentRequestListByLecturerId(lectureId: number) {
    return await this.prismaService.payment.findMany({
      where: {
        statusId: PaymentOrderStatus.WAITING_FOR_DEPOSIT,
        reservation: { some: { lectureSchedule: { lectureId } } },
      },
      include: {
        user: { include: { userProfileImage: true } },
        paymentProductType: true,
        paymentStatus: true,
        paymentMethod: true,
        paymentCouponUsage: true,
        transferPaymentInfo: { include: { lecturerBankAccount: true } },
        refundPaymentInfo: {
          include: { refundStatus: true, refundUserBankAccount: true },
        },
        reservation: {
          include: { lectureSchedule: true },
        },
        cardPaymentInfo: { include: { issuer: true, acquirer: true } },
        virtualAccountPaymentInfo: { include: { bank: true } },
        paymentPassUsage: { include: { lecturePass: true } },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async getPaymentRequest(
    paymentId: number,
    lecturerId: number,
  ): Promise<IPayment> {
    return this.prismaService.payment.findFirst({
      where: {
        id: paymentId,
        lecturerId,
        paymentProductType: { name: PaymentProductTypes.클래스 },
      },
      include: {
        transferPaymentInfo: true,
        reservation: { include: { lectureSchedule: true } },
      },
    });
  }

  async getTransferPayment(paymentId: number) {
    return this.prismaService.transferPaymentInfo.findUnique({
      where: { paymentId },
    });
  }

  async trxUpdateTransferPayment(
    transaction: PrismaTransaction,
    paymentId: number,
    refundPaymentUpdateData: IRefundPaymentUpdateData,
  ) {
    try {
      await transaction.refundPaymentInfo.update({
        where: { paymentId },
        data: refundPaymentUpdateData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 결제 정보 수정 실패: ${error}`,
        'PrismaUpdateFailed',
      );
    }
  }

  async trxIncrementLectureLearner(
    transaction: PrismaTransaction,
    userId: number,
    lecturerId: number,
    enrollmentCount: number,
  ) {
    await transaction.lecturerLearner.update({
      where: { userId_lecturerId: { userId, lecturerId } },
      data: { enrollmentCount: { increment: enrollmentCount } },
    });
  }
}
