interface TemporaryLectureInputData {
  title?: string;
  introduction?: string;
  curriculum?: string;
  detailAddress?: string;
  duration?: number;
  difficultyLevel?: string;
  minCapacity?: number;
  maxCapacity?: number;
  reservationComment?: string;
  reservationDeadline?: Date;
  price?: number;
  noShowDeposit?: number;
}

interface TemporaryLectureToRegionInputData {
  lectureId: number;
  regionId?: number;
}

interface TemporaryLectureScheduleInputData {
  lectureId: number;
  startDateTime?: Date;
  numberOfParticipants?: number;
}

interface RegularTemporaryLectureScheduleInputData {
  lectureId: number;
  team?: string;
  startDateTime?: Date;
  numberOfParticipants?: number;
}

interface TemporaryLectureImageInputData {
  lectureId: number;
  imageUrl?: string;
}

interface TemporaryLectureToDanceGenreInputData {
  lectureId: number;
  danceCategoryId?: number;
  name?: string;
}

interface TemporaryLectureNotificationResponse {
  notification?: string;
}

interface TemporaryLectureHolidayInputData {
  lectureId: number;
  holiday?: Date;
}

interface RegularTemporaryLectureSchedules {
  regularSchedules?: { [key: string]: string[] };
}

export {
  TemporaryLectureInputData,
  TemporaryLectureToRegionInputData,
  TemporaryLectureImageInputData,
  TemporaryLectureScheduleInputData,
  TemporaryLectureToDanceGenreInputData,
  TemporaryLectureNotificationResponse,
  TemporaryLectureHolidayInputData,
  RegularTemporaryLectureSchedules,
  RegularTemporaryLectureScheduleInputData,
};
