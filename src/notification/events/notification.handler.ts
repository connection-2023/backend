import { NotificationService } from './../services/notification.service';
import { EventsHandler } from '@nestjs/cqrs';
import { PrismaService } from '@src/prisma/prisma.service';
import { NewLectureEvent, NewReservationEvent } from './notification.event';

@EventsHandler([NewLectureEvent, NewReservationEvent])
export class NotificationHandler {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly prismaService: PrismaService,
  ) {}
  async handleNewLectureEvent(event: NewLectureEvent) {
    const { lectureId } = event;

    const lecturer = await this.prismaService.lecture.findFirst({
      where: { id: lectureId },
    });

    const targets = await this.prismaService.likedLecturer.findMany({
      where: { lecturerId: lecturer.id },
      select: { userId: true },
    });

    targets.map(async (target) => {
      await this.notificationService.createNotification(
        target,
        { lectureId },
        NotificationType.NewLecture,
      );
    });
  }

  handleNewReservationEvent(event: NewReservationEvent) {}
}
