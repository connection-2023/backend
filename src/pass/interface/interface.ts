export interface LecturePassInputData {
  lecturerId: number;
  title: string;
  price: number;
  maxUsageCount: number;
  availableMonths: number;
}

export interface LecturePassTargetInputData {
  lectureId: number;
  lecturePassId;
}
