interface LectureInputData {
  regionId: number;
  lectureTypeId: number;
  danceCategoryId: number;
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
