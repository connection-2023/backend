import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  LectureCoupon,
  LecturePaymentInputData,
  LectureSchedule,
  ReservationInputData,
} from '../interface/payments.interface';
import { PrismaTransaction } from '@src/common/interface/common-interface';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prismaService: PrismaService) {}
  /**
   * 1.  유저 쿠폰 리스트에서 쿠폰들고옴 이떄 조건 해당 랙처 id일떄 또한 사용 안한 쿠폰
   * 2. 가져와야할것 강의 가격, 퍼센트, 할인가격 최대 가격
   * 3.
   */
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

  async getLectureCouponTarget(lectureId: number, couponIds: number[]) {
    return await this.prismaService.lectureCouponTarget.findMany({
      where: {
        lectureId,
        lectureCouponId: {
          in: couponIds,
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
    return await this.prismaService.lecturePayment.findFirst({
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

  async getPaymentMethod(method: string) {
    return await this.prismaService.paymentMethod.findFirstOrThrow({
      where: { name: method },
    });
  }

  async getPaymentStatus(status) {
    return await this.prismaService.paymentStatus.findFirstOrThrow({
      where: { name: status },
    });
  }

  async createLecturePayment(
    transaction: PrismaTransaction,
    lecturePaymentInputData: LecturePaymentInputData,
  ) {
    return await transaction.lecturePayment.create({
      data: lecturePaymentInputData,
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
}
