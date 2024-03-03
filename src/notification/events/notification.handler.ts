import { EventsHandler } from '@nestjs/cqrs';
import { newLectureEvent, newReservationEvent } from './notification.event';

@EventsHandler([newLectureEvent, newReservationEvent])
export class NotificationHandle {
  handleNewLectureEvent(event: newLectureEvent) {}

  handleNewReservationEvent(event: newReservationEvent) {}
}
