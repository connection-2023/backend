export interface UserReportInputData extends ReportInputData {
  reportedUserId: number;
}

export interface LecturerReportInputData extends ReportInputData {
  reportedLecturerId: number;
}

export interface ReportInputData {
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

export interface ReportTargetData {
  reportTargetTable: string;
  reportTargetReviewTable: string;
  reportTargetTypeTable: string;
  reportedTarget: {
    reportedUserId: number | undefined;
    reportedLecturerId: number | undefined;
  };
}

export interface ReportTypeInputData {
  reportId: number;
  reportTypeId: number;
}
