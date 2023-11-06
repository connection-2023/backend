interface TemporaryLectureInputData {
  lecturerId?: number;
  lectureId?: number;
  lectureMethodId?: number;
  lectureTypeId?: number;
  startDate?: Date;
  endDate?: Date;
  title?: string;
  introduction?: string;
  curriculum?: string;
  detailAddress?: string;
  duration?: number;
  difficultyLevel?: string;
  minCapacity?: number;
  maxCapacity?: number;
  reservationComment?: string;
  reservationDeadline?: number;
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
  endDateTime?: Date;
  numberOfParticipants?: number;
}

interface RegularTemporaryLectureScheduleInputData {
  lectureId: number;
  team?: string;
  startDateTime?: Date;
  endDateTime?: Date;
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

interface TemporaryLectureCouponTargetInputData {
  lectureCouponId: number;
  lectureId: number;
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
  TemporaryLectureCouponTargetInputData,
};
