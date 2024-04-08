export class LikedLecturerNewLectureEvent {
  constructor(
    public readonly lectureId: number,
    public readonly lecturerId: number,
  ) {}
}

export class CreatedReservationEvent {
  constructor(public readonly reservationId: number) {}
}
