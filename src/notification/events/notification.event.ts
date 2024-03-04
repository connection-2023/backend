import { INotificationTarget } from '../interfaces/notification.interface';

export class NewLectureEvent {
  constructor(public readonly lectureId: number) {}
}

export class NewReservationEvent {
  constructor(
    public readonly reservationId: number,
    public readonly target: INotificationTarget,
  ) {}
}
