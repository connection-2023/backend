import { PrismaService } from '@src/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventBus } from '@nestjs/cqrs';
import { DiscountCouponExpiringEvent } from '@src/notification/events/notification.event';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async updateActiveLecture() {
    const closedLecture = await this.prismaService.lecture.updateMany({
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

    this.logger.log('closedLecture', closedLecture);
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async sendExpireCouponNotification() {
    const today = new Date();
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);

    const coupons = await this.prismaService.lectureCoupon.findMany({
      where: {
        endAt: {
          gt: new Date(),
          lt: sevenDaysLater,
        },
      },
    });

    await Promise.all(
      coupons.map(async (coupon) =>
        this.eventBus.publish(new DiscountCouponExpiringEvent(coupon.id)),
      ),
    );
  }
}
