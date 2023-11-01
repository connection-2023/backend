import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  LectureCoupon,
  LectureCouponUseage,
  LecturePaymentUpdateData,
  LectureSchedule,
  PaymentInputData,
  ReservationInputData,
} from '@src/payments/interface/payments.interface';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import { PaymentProductTypes, PaymentStatus } from '../enum/payment.enum';
import { PaymentProductType } from '@prisma/client';

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
    console.log(id);

    return await this.prismaService.paymentMethod.findFirstOrThrow({
      where: { id },
    });
  }

  async getPaymentStatus(status: PaymentStatus) {
    return await this.prismaService.paymentStatus.findFirstOrThrow({
      where: { name: status },
    });
  }

  async createPayment(
    transaction: PrismaTransaction,
    paymentInputData: PaymentInputData,
  ) {
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

  async getLecturePaymentInfo(orderId: string) {
    return await this.prismaService.payment.findUnique({
      where: { orderId },
      select: {
        orderId: true,
        price: true,
        paymentStatus: {
          select: {
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
}
