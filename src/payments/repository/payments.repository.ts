import { Injectable } from '@nestjs/common';
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
import { PaymentProductTypes, PaymentOrderStatus } from '../enum/payment.enum';
import { Payment, PaymentProductType, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserCoupon(
    userId,
    lectureCouponId,
    isStackable,
  ): Promise<LectureCoupon> {
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
            percentage: true,
            discountPrice: true,
            maxDiscountPrice: true,
          },
        },
      },
    });
  }

  async getLectureCouponTarget(
    lectureId: number,
    couponIds: number[],
  ): Promise<LectureCouponUseage[]> {
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
  }

  async getLecture(lectureId) {
    return await this.prismaService.lecture.findUnique({
      where: { id: lectureId },
    });
  }
  async getUserLecturePayment(userId: number, orderId: string) {
    return await this.prismaService.payment.findFirst({
      where: { userId, orderId },
    });
  }

  async getLectureSchedule(lectureScheduleId: number) {
    return await this.prismaService.lectureSchedule.findFirst({
      where: {
        id: lectureScheduleId,
      },
    });
  }

  async getPaymentMethod(id: number) {
    return await this.prismaService.paymentMethod.findFirstOrThrow({
      where: { id },
    });
  }

  async getPaymentStatus(id: number): Promise<PaymentStatus> {
    return await this.prismaService.paymentStatus.findFirstOrThrow({
      where: { id },
    });
  }

  async createPayment(
    transaction: PrismaTransaction,
    paymentInputData: PaymentInputData,
  ): Promise<Payment> {
    return await transaction.payment.create({
      data: paymentInputData,
    });
  }

  async trxUpdateLectureScheduleParticipants(
    transaction: PrismaTransaction,
    lectureSchedule: LectureSchedule,
  ) {
    await transaction.lectureSchedule.update({
      where: { id: lectureSchedule.lectureScheduleId },
      data: {
        numberOfParticipants: {
          increment: lectureSchedule.participants,
        },
      },
    });
  }

  async trxCreateReservation(
    transaction: PrismaTransaction,
    reservationInputData: ReservationInputData,
  ) {
    await transaction.reservation.create({ data: reservationInputData });
  }

  async trxUpdateLectureCouponUseage(
    transaction: PrismaTransaction,
    couponIds: number[],
  ) {
    await transaction.lectureCoupon.updateMany({
      where: { id: { in: couponIds } },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });
  }

  async trxCreatePaymentCouponUsage(
    transaction: PrismaTransaction,
    paymentCouponUsageInputData,
  ) {
    await transaction.paymentCouponUsage.create({
      data: paymentCouponUsageInputData,
    });
  }

  async trxUpdateUserCouponUsage(
    transaction: PrismaTransaction,
    userId: number,
    couponIds: number[],
  ) {
    await transaction.userCoupon.updateMany({
      where: { userId, lectureCouponId: { in: couponIds } },
      data: { isUsed: true },
    });
  }

  async getPaymentInfo(orderId: string) {
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
  }

  async updateLecturePayment(
    orderId: string,
    updateData: LecturePaymentUpdateData,
  ) {
    return await this.prismaService.payment.update({
      where: { orderId },
      data: updateData,
    });
  }

  async trxUpdateLecturePaymentStatus(
    transaction: PrismaTransaction,
    paymentId: number,
    statusId: number,
  ) {
    return await transaction.payment.update({
      where: { id: paymentId },
      data: { statusId },
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
      },
    });
  }

  async getPaymentProductType(
    productType: PaymentProductTypes,
  ): Promise<PaymentProductType> {
    return this.prismaService.paymentProductType.findFirst({
      where: { name: productType },
    });
  }

  async getCard(code: string) {
    return this.prismaService.card.findUnique({ where: { code } });
  }

  async trxCreateCardPaymentInfo(
    transaction: PrismaTransaction,
    cardPaymentInfoInputData: CardPaymentInfoInputData,
  ) {
    return await transaction.cardPaymentInfo.create({
      data: cardPaymentInfoInputData,
    });
  }

  async getBankInfo(code: string) {
    return await this.prismaService.bank.findUnique({ where: { code } });
  }

  async trxCreateVirtualAccountPaymentInfo(
    transaction: PrismaTransaction,
    virtualAccountPaymentInfoInputData: VirtualAccountPaymentInfoInputData,
  ) {
    return await transaction.virtualAccountPaymentInfo.create({
      data: virtualAccountPaymentInfoInputData,
    });
  }
}
