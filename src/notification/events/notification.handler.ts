import { NotificationService } from './../services/notification.service';
import { EventsHandler } from '@nestjs/cqrs';
import { PrismaService } from '@src/prisma/prisma.service';
import { NotificationType } from '../enum/notification.enum';
import {
  CreatedLectureEvent,
  CreatedReservationEvent,
} from './notification.event';

@EventsHandler([CreatedLectureEvent, CreatedReservationEvent])
export class NotificationHandler {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly prismaService: PrismaService,
  ) {}

  async handle(event: CreatedLectureEvent | CreatedReservationEvent) {
    switch (event.constructor) {
      case CreatedLectureEvent:
        await this.handleCreatedLectureEvent(event as CreatedLectureEvent);
        break;
      case CreatedReservationEvent:
        await this.handleCreatedReservationEvent(
          event as CreatedReservationEvent,
        );
        break;
    }
  }

  private async handleCreatedLectureEvent(event: CreatedLectureEvent) {
    const { lectureId, lecturerId } = event;
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

  private async handleCreatedReservationEvent(event: CreatedReservationEvent) {
    const { reservationId } = event;
    const reservation = await this.prismaService.reservation.findFirst({
      where: { id: reservationId },
      select: { userId: true, lecture: { select: { lecturerId: true } } },
    });
    const targets = [
      { userId: reservation.userId },
      { lecturerId: reservation.lecture.lecturerId },
    ];
  }
}
