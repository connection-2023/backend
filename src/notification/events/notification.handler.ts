import { NotificationService } from './../services/notification.service';
import { EventsHandler } from '@nestjs/cqrs';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  CreatedReservationEvent,
  LikedLecturerNewLectureEvent,
} from './notification.event';
import {
  INotificationSource,
  INotificationTarget,
} from '../interfaces/notification.interface';

@EventsHandler([LikedLecturerNewLectureEvent, CreatedReservationEvent])
export class NotificationHandler {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly prismaService: PrismaService,
  ) {}

  async handle(event: LikedLecturerNewLectureEvent | CreatedReservationEvent) {
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
    }
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

    await this.sendNotification(targets, title, { lectureId }, description);
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
        ? reservation.regularLectureStatus.regularLectureSchedule
        : reservation.lectureSchedule
    } 수업을 신청하셨습니다.`;

    await this.sendNotification(
      targets,
      title,
      { reservationId: reservation.id },
      description,
    );
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
}
