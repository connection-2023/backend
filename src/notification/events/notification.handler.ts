import { NotificationService } from './../services/notification.service';
import { EventsHandler } from '@nestjs/cqrs';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  CreatedReservationEvent,
  DiscountCouponExpiringEvent,
  LecturePassExpiringEvent,
  LikedLecturerNewLectureEvent,
} from './notification.event';
import {
  INotificationSource,
  INotificationTarget,
} from '../interfaces/notification.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../schemas/notification.schema';

@EventsHandler(
  LikedLecturerNewLectureEvent,
  CreatedReservationEvent,
  DiscountCouponExpiringEvent,
  LecturePassExpiringEvent,
)
export class NotificationHandler {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly prismaService: PrismaService,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  async handle(
    event:
      | LikedLecturerNewLectureEvent
      | CreatedReservationEvent
      | DiscountCouponExpiringEvent
      | LecturePassExpiringEvent,
  ) {
    switch (event.constructor) {
      case LikedLecturerNewLectureEvent:
        await this.handleLikedLecturerNewLectureEvent(
          event as LikedLecturerNewLectureEvent,
        );
        break;

      case CreatedReservationEvent:
        await this.handleCreatedReservationEvent(
          event as CreatedReservationEvent,
        );
        break;

      case DiscountCouponExpiringEvent:
        await this.handleDiscountCouponExpiringEvent(
          event as DiscountCouponExpiringEvent,
        );
        break;

      case LecturePassExpiringEvent:
        await this.handleLecturePassExpiringEvent(
          event as LecturePassExpiringEvent,
        );
        break;
    }
  }

  private async sendNotification(
    targets: INotificationTarget[],
    title: string,
    source: INotificationSource,
    description: string,
  ) {
    await Promise.all(
      targets.map(async (target) => {
        return this.notificationService.createNotification(
          target,
          title,
          source,
          description,
        );
      }),
    );
  }

  private async handleLikedLecturerNewLectureEvent(
    event: LikedLecturerNewLectureEvent,
  ) {
    const { lectureId, lecturerId } = event;
    const { title } = await this.prismaService.lecture.findFirst({
      where: { id: lectureId },
      select: { title: true },
    });
    const targets = await this.prismaService.likedLecturer.findMany({
      where: { lecturerId },
      select: { userId: true },
    });
    const description = '관심강사가 새로운 클래스를 개설했습니다.';

    await this.sendNotification(
      targets,
      title,
      { lectureId, lecturerId },
      description,
    );
  }

  private async handleCreatedReservationEvent(event: CreatedReservationEvent) {
    const { reservationId } = event;
    const reservation = await this.prismaService.reservation.findFirst({
      where: { id: reservationId },
      include: {
        lecture: true,
        regularLectureStatus: {
          select: {
            regularLectureSchedule: {
              orderBy: { startDateTime: 'asc' },
              take: 1,
            },
          },
        },
        lectureSchedule: true,
      },
    });
    const targets = [
      { userId: reservation.userId },
      { lecturerId: reservation.lecture.lecturerId },
    ];
    const title = reservation.lecture.title;
    const description = `${
      reservation.regularLectureStatus
        ? reservation.regularLectureStatus.regularLectureSchedule[0]
            .startDateTime
        : reservation.lectureSchedule.startDateTime
    } 수업을 신청하셨습니다.`;

    await this.sendNotification(targets, title, { reservationId }, description);
  }

  private async handleDiscountCouponExpiringEvent(
    event: DiscountCouponExpiringEvent,
  ) {
    const { couponId } = event;
    const coupon = await this.prismaService.lectureCoupon.findFirst({
      where: { id: couponId },
      include: { userCoupon: true, lecturer: true },
    });
    const targets = coupon.userCoupon.map((userCoupon) => ({
      userId: userCoupon.userId,
    }));
    const lecturerName = coupon.lecturer.nickname;
    const formattedDiscountType = coupon.percentage
      ? `${coupon.percentage}%`
      : `${coupon.discountPrice}원`;
    const title = `${lecturerName}의 ${formattedDiscountType} 할인 쿠폰`;
    const description = '쿠폰 만료일이 7일 남았습니다.';

    await this.sendNotification(targets, title, { couponId }, description);
  }

  private async handleLecturePassExpiringEvent(
    event: LecturePassExpiringEvent,
  ) {
    const { userPassId } = event;
    const userPass = await this.prismaService.userPass.findFirst({
      where: { id: userPassId },
      include: {
        users: true,
        lecturePass: {
          include: { lecturePassTarget: { include: { lecture: true } } },
        },
      },
    });
    const targets = [{ userId: userPass.userId }];
    const title = userPass.lecturePass.title;
    const description = '패스권 만료일이 7일 남았습니다.';

    await this.sendNotification(targets, title, { userPassId }, description);
  }
}
