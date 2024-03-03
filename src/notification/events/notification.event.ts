import { INotificationTarget } from '../interfaces/notification.interface';

export class newLectureEvent {
  constructor(
    public readonly lectureId: number,
    public readonly target: INotificationTarget,
  ) {}
}

export class newReservationEvent {
  constructor(
    public readonly reservationId: number,
    public readonly target: INotificationTarget,
  ) {}
}
