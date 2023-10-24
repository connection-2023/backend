interface LectureInputData {
  title: string;
  introduction?: string;
  curriculum: string;
  detailAddress?: string;
  duration: number;
  difficultyLevel: string;
  minCapacity: number;
  maxCapacity: number;
  reservationComment?: string;
  reservationDeadline: Date;
  price: number;
  noShowDeposit?: number;
}

interface LectureToRegionInputData {
  lectureId: number;
  regionId: number;
}

interface LectureScheduleInputData {
  lectureId: number;
  startDateTime: Date;
  numberOfParticipants: number;
}

interface RegularLectureScheduleInputData {
  lectureId: number;
  team: string;
  startDateTime: Date;
  numberOfParticipants: number;
}

interface LectureImageInputData {
  lectureId: number;
  imageUrl: string;
}

interface LectureToDanceGenreInputData {
  lectureId: number;
  danceCategoryId: number;
  name?: string;
}

interface LectureNotificationResponse {
  notification: string;
}

interface LectureHolidayInputData {
  lectureId: number;
  holiday: Date;
}

interface RegularLectureSchedules {
  regularSchedules: { [key: string]: string[] };
}

export {
  LectureInputData,
  LectureToRegionInputData,
  LectureImageInputData,
  LectureScheduleInputData,
  LectureToDanceGenreInputData,
  LectureNotificationResponse,
  LectureHolidayInputData,
  RegularLectureSchedules,
  RegularLectureScheduleInputData,
};
