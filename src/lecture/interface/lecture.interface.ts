interface LectureInputData {
  lectureTypeId: number;
  lectureMethodId: number;
  title: string;
  introduction: string;
  curriculum: string;
  detailAddress: string;
  duration: number;
  difficultyLevel: string;
  minCapacity: number;
  maxCapacity: number | null;
  reservationComment: string | null;
  reservationDeadline: Date;
  price: number;
  noShowDeposit: number | null;
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

interface LectureImageInputData {
  lectureId: number;
  imageUrl: string;
}

interface LectureToDanceGenreInputData {
  lectureId: number;
  danceCategoryId: number;
  name?: string;
}

export {
  LectureInputData,
  LectureToRegionInputData,
  LectureImageInputData,
  LectureScheduleInputData,
  LectureToDanceGenreInputData,
};
