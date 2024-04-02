import { NotificationService } from './../services/notification.service';
import { EventsHandler } from '@nestjs/cqrs';
import { PrismaService } from '@src/prisma/prisma.service';
import { NotificationType } from '../enum/notification.enum';
import {
  CreatedLectureEvent,
  CreatedReservationEvent,
} from './notification.event';

@EventsHandler(CreatedLectureEvent)
export class NotificationHandler {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly prismaService: PrismaService,
  ) {}
  async handle(event: CreatedLectureEvent | CreatedReservationEvent) {
    switch (event.constructor) {
      case CreatedLectureEvent:
        const lectureEvent = event as CreatedLectureEvent;
        const { lectureId, lecturerId } = lectureEvent;
        const targets = await this.prismaService.likedLecturer.findMany({
          where: { lecturerId },
          select: { userId: true },
        });
        const description = '관심강사가 새로운 클래스를 개설했습니다.';

        await Promise.all(
          targets.map(async (target) => {
            return await this.notificationService.createNotification(
              target,
              { lectureId },
              description,
            );
          }),
        );
    }
  }
}
