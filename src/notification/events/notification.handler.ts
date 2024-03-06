import { NotificationService } from './../services/notification.service';
import { EventsHandler } from '@nestjs/cqrs';
import { PrismaService } from '@src/prisma/prisma.service';
import { NewLectureEvent, NewReservationEvent } from './notification.event';
import { NotificationType } from '../enum/notification.enum';

@EventsHandler(NewLectureEvent)
export class NotificationHandler {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly prismaService: PrismaService,
  ) {}
  async handle(event: NewLectureEvent | NewReservationEvent) {
    switch (event.constructor) {
      case NewLectureEvent:
        const lectureEvent = event as NewLectureEvent;

        const { lectureId, lecturerId } = lectureEvent;

        const targets = await this.prismaService.likedLecturer.findMany({
          where: { lecturerId },
          select: { userId: true },
        });

        targets.map(async (target) => {
          return await this.notificationService.createNotification(
            target,
            { lectureId },
            NotificationType.NewLecture,
          );
        });
    }
  }
}
