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

  @Cron(CronExpression.EVERY_HOUR)
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

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
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

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
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
}
