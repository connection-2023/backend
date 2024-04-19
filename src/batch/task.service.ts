import { PrismaService } from '@src/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventBus } from '@nestjs/cqrs';
import {
  DiscountCouponExpiringEvent,
  LecturePassExpiringEvent,
} from '@src/notification/events/notification.event';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  @Cron(CronExpression.EVERY_HOUR, {
    name: 'updateClosedLecture',
    disabled: process.env.NODE_ENV === 'development',
  })
  async updateClosedLecture() {
    const closedLectures = await this.prismaService.lecture.updateMany({
      where: {
        isActive: true,
        lectureSchedule: { every: { startDateTime: { lte: new Date() } } },
        regularLectureStatus: {
          every: {
            regularLectureSchedule: {
              every: { startDateTime: { lte: new Date() } },
            },
          },
        },
      },
      data: { isActive: false },
    });

    this.logger.log('Update closed lecture', closedLectures.count);
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON, {
    name: 'sendExpireCouponNotification',
    disabled: process.env.NODE_ENV === 'development',
    timeZone: 'Asia/Seoul',
  })
  async sendExpireCouponNotification() {
    const sevenDaysLater = new Date(
      new Date().setHours(0, 0, 0, 0) + 7 * 24 * 60 * 60 * 1000,
    );
    const eightDaysLater = new Date(
      new Date().setHours(0, 0, 0, 0) + 8 * 24 * 60 * 60 * 1000,
    );
    const coupons = await this.prismaService.lectureCoupon.findMany({
      where: {
        endAt: {
          gte: sevenDaysLater,
          lt: eightDaysLater,
        },
      },
    });

    await Promise.all(
      coupons.map(async (coupon) =>
        this.eventBus.publish(new DiscountCouponExpiringEvent(coupon.id)),
      ),
    );

    this.logger.log('Send expire coupons notification', coupons.length);
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON, {
    name: 'sendExpirePassNotification',
    disabled: process.env.NODE_ENV === 'development',
    timeZone: 'Asia/Seoul',
  })
  async sendExpirePassNotification() {
    const sevenDaysLater = new Date(
      new Date().setHours(0, 0, 0, 0) + 7 * 24 * 60 * 60 * 1000,
    );
    const eightDaysLater = new Date(
      new Date().setHours(0, 0, 0, 0) + 8 * 24 * 60 * 60 * 1000,
    );
    const userPass = await this.prismaService.userPass.findMany({
      where: {
        endAt: {
          gte: sevenDaysLater,
          lt: eightDaysLater,
        },
      },
    });

    await Promise.all(
      userPass.map(async (pass) =>
        this.eventBus.publish(new LecturePassExpiringEvent(pass.id)),
      ),
    );

    this.logger.log('Send expire pass notification', userPass.length);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'validateLectureReview',
    disabled: process.env.NODE_ENV === 'development',
    timeZone: 'Asia/Seoul',
  })
  async validateLectureReview() {
    await this.updateLectureReview();
    await this.updateLecturerReveiw();

    this.logger.log('Validate lecture review');
  }

  private async updateLectureReview() {
    const lectures = await this.prismaService.lecture.findMany({
      where: { deletedAt: null },
      select: { id: true },
    });

    await Promise.all(
      lectures.map(async (lecture) => {
        const reviewCount = await this.prismaService.lectureReview.count({
          where: { lectureId: lecture.id, deletedAt: null },
        });
        const stars = await this.prismaService.lectureReview.aggregate({
          where: { lectureId: lecture.id, deletedAt: null },
          _avg: { stars: true },
        });
        const rountStars = Math.round(stars._avg.stars * 10) / 10;

        if (lecture.id === 184) {
          console.log(
            `reviewCount = ${reviewCount}, rountStars: ${rountStars}`,
          );
        }
        await this.prismaService.lecture.update({
          where: { id: lecture.id },
          data: { reviewCount, stars: rountStars },
        });
      }),
    );
  }

  private async updateLecturerReveiw() {
    const lecturers = await this.prismaService.lecturer.findMany({
      where: { deletedAt: null },
      select: { id: true },
    });

    await Promise.all(
      lecturers.map(async (lecturer) => {
        const reviewCount = await this.prismaService.lectureReview.count({
          where: {
            lecture: { lecturerId: lecturer.id, deletedAt: null },
            deletedAt: null,
          },
        });
        const stars = await this.prismaService.lectureReview.aggregate({
          where: {
            lecture: { lecturerId: lecturer.id, deletedAt: null },
            deletedAt: null,
          },
          _avg: { stars: true },
        });
        const rountStars = Math.round(stars._avg.stars * 10) / 10;

        this.prismaService.lecturer.update({
          where: { id: lecturer.id },
          data: { reviewCount, stars: rountStars },
        });
      }),
    );
  }
}
