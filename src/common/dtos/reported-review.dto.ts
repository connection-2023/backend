import { ApiProperty } from '@nestjs/swagger';
import { LecturerReportedReview, UserReportedReview } from '@prisma/client';

export class ReportedReviewDto
  implements UserReportedReview, LecturerReportedReview
{
  id: number;
  reportId: number;

  @ApiProperty({
    description: '신고한 강사 리뷰 id',
  })
  lectureReviewId: number;

  @ApiProperty({
    description: '신고한 강의 리뷰 id',
  })
  lecturerReviewId: number;

  @ApiProperty({
    description: '내용 ',
  })
  description: string;

  constructor(reportedReview: Partial<ReportedReviewDto>) {
    this.description = reportedReview.description;
    this.lectureReviewId = reportedReview.lectureReviewId;
    this.lecturerReviewId = reportedReview.lecturerReviewId;

    Object.seal(this);
  }
}
