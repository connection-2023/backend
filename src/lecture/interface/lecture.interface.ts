interface LectureInputData {
  isGroup: boolean;
  startDate: Date;
  endDate: Date;
  title: string;
  introduction?: string;
  curriculum: string;
  detailAddress?: string;
  duration: number;
  difficultyLevel: string;
  minCapacity?: number;
  maxCapacity?: number;
  reservationComment?: string;
  reservationDeadline: number;
  price: number;
  noShowDeposit?: number;
}

interface LectureToRegionInputData {
  lectureId: number;
  regionId: number;
}

interface LectureScheduleInputData {
  lectureId: number;
  day?: string[];
  startDateTime: Date;
  endDateTime: Date;
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
  day: string[];
  startDateTime: Date[];
}

interface LectureCouponTargetInputData {
  lectureCouponId: number;
  lectureId: number;
}

interface LectureOrderBy {
  createdAt?: string;
  starts?: string;
  price?: string;
}

interface LectureLocation {
  address: string;
  detailAddress: string;
  buildingName: string;
}

interface LectureLocationInputData {
  lectureId: number;
  address: string;
  detailAddress: string;
  buildingName: string;
}

interface LectureLikeInputData {
  lectureId: number;
  userId: number;
}

interface LikedLectureReviewWhereData {
  userId?: number;
  lecturerId?: number;
}

interface EnrollLectureReservationResponseData {
  id: number;
  userId: number;
  paymentId: number;
  lectureScheduleId: number;
  representative: string;
  phoneNumber: string;
  participants: number;
  requests: string | null;
  lectureSchedule: {
    startDateTime: Date;
    lecture: {
      id: number;
      lecturerId: number;
      title: string;
    };
  };
}

interface LectureScheduleResponseData {
  id: number;
  lecturerId: number;
  lectureTypeId: number;
  lectureMethodId: number;
  isGroup: boolean;
  startDate: Date;
  endDate: Date;
  title: string;
  introduction: string;
  curriculum: string;
  duration: number;
  difficultyLevel: string;
  minCapacity: number;
  maxCapacity: number;
  reservationDeadline: number;
  reservationComment: string;
  price: number;
  noShowDeposit: number;
  reviewCount: number;
  stars: number;
  isActive: boolean;
  locationDescription: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  _count: { lectureSchedule: number };
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
  LectureCouponTargetInputData,
  LectureOrderBy,
  LectureLocation,
  LectureLocationInputData,
  LectureLikeInputData,
  LikedLectureReviewWhereData,
  EnrollLectureReservationResponseData,
  LectureScheduleResponseData,
};
