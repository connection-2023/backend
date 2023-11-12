import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  CardInfo,
  CardPaymentInfoInputData,
  LectureCoupon,
  LectureCouponUseage,
  LecturePaymentUpdateData,
  LectureSchedule,
  PaymentInputData,
  ReservationInputData,
  VirtualAccountPaymentInfoInputData,
} from '@src/payments/interface/payments.interface';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import {
  PaymentProductTypes,
  PaymentOrderStatus,
  PaymentMethods,
} from '../enum/payment.enum';
import { Payment, PaymentProductType, PaymentStatus } from '@prisma/client';

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
      throw new InternalServerErrorException(
        `Prisma 결제 정보 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }

  async trxUpdateLectureScheduleParticipants(
    transaction: PrismaTransaction,
    lectureSchedule: LectureSchedule,
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
  ) {
    try {
      await transaction.userCoupon.updateMany({
        where: { userId, lectureCouponId: { in: couponIds } },
        data: { isUsed: true },
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
          price: true,
          paymentStatus: {
            select: {
              id: true,
              name: true,
            },
          },
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

  async trxUpdateLecturePaymentStatus(
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
          price: true,
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
              lectureSchedule: { select: { startDateTime: true, team: true } },
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
    productType: PaymentProductTypes,
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
      where: { orderId, userId, statusId: PaymentOrderStatus.DONE },
      select: {
        orderId: true,
        orderName: true,
        price: true,
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
      },
    });
  }

  async getPaymentResult(paymentId) {
    try {
      return await this.prismaService.payment.findUnique({
        where: { id: paymentId },
        select: {
          orderId: true,
          orderName: true,
          price: true,
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
              lectureSchedule: { select: { startDateTime: true, team: true } },
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
    } catch (error) {}
  }
}
