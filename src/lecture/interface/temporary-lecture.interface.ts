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
  date?: string;
  dateTime?: string;
  numberOfParticipants?: number;
}

interface RegularTemporaryLectureScheduleInputData {
  lectureId: number;
  team?: string;
  dateTime?: string;
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

interface TemporaryLectureCouponTargetInputData {
  lectureCouponId: number;
  lectureId: number;
}

interface TemporaryLectureSchedules {
  day?: string[];
  date?: string;
  dateTime?: string[];
}

interface TemporaryLectureDayInputData {
  lectureId: number;
  day: string[];
}

interface TemporaryLectureDayScheduleInpuData {
  lectureDayId: number;
  dateTime: string;
}

interface TemporaryLectureLocation {
  address?: string;
  detailAddress?: string;
  buildingName?: string;
  administrativeDistrict?: string;
  district?: string;
}

interface TemporaryLectureLocationInputData {
  lectureId: number;
  address?: string;
  detailAddress?: string;
  buildingName?: string;
}

export {
  TemporaryLectureInputData,
  TemporaryLectureToRegionInputData,
  TemporaryLectureImageInputData,
  TemporaryLectureScheduleInputData,
  TemporaryLectureToDanceGenreInputData,
  TemporaryLectureNotificationResponse,
  TemporaryLectureHolidayInputData,
  RegularTemporaryLectureScheduleInputData,
  TemporaryLectureCouponTargetInputData,
  TemporaryLectureSchedules,
  TemporaryLectureDayInputData,
  TemporaryLectureDayScheduleInpuData,
  TemporaryLectureLocation,
  TemporaryLectureLocationInputData,
};
