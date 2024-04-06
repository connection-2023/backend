import { INotificationTarget } from '../interfaces/notification.interface';

export class CreatedLectureEvent {
  constructor(
    public readonly lectureId: number,
    public readonly lecturerId: number,
  ) {}
}

export class CreatedReservationEvent {
  constructor(public readonly reservationId: number) {}
}
