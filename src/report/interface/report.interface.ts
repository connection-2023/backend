export interface UserReportInputData extends ReportInputData {
  reportedUserId: number;
}

export interface ReportInputData {
  reportTypeId: number;
  targetUserId?: number;
  targetLecturerId?: number;
  reason?: string;
}

export interface ReportedReviewInputData extends ReviewData {
  reportId: number;
}

export interface ReviewData {
  description: string;
  lectureReviewId?: number;
  lecturerReviewId?: number;
}
