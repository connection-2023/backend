import { LecturerReport } from '@prisma/client';
import { BaseReturnDto } from './base-return.dto';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ReportResponseDto } from './report-response.dto';
import { LecturerDto } from './lecturer.dto';
import { ReportedTypeDto } from './user-report-type.dto';
import { ReportedReviewDto } from './reported-review.dto';

export class LecturerReportDto extends BaseReturnDto implements LecturerReport {
  id: number;
  reportedLecturerId: number;
  targetUserId: number;
  targetLecturerId: number;
  @ApiProperty({
    description: '이유',
    nullable: true,
  })
  reason: string | null;

  @ApiProperty({
    description: '답변 여부',
    type: Boolean,
  })
  isAnswered: boolean;

  @ApiProperty({
    description: '신고 생성일',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: '신고 답변일',
    type: Date,
  })
  updatedAt: Date;

  @ApiProperty({
    description: '신고 한 강사 정보',
    type: LecturerDto,
  })
  reportedLecturer?: LecturerDto;

  @ApiProperty({
    description: '신고 당한 유저 정보',
    type: UserDto,
    nullable: true,
  })
  targetUser?: UserDto;

  @ApiProperty({
    description: '신고 당한 강사 정보',
    type: LecturerDto,
    nullable: true,
  })
  targetLecturer?: LecturerDto;

  @ApiProperty({
    description: '관리자 답변',
    type: ReportResponseDto,
    nullable: true,
  })
  lecturerReportResponse?: ReportResponseDto;

  @ApiProperty({
    description: '신고 유형',
    type: ReportedTypeDto,
    isArray: true,
  })
  lecturerReportType?: ReportedTypeDto[];

  @ApiProperty({
    description: '신고한 댓글 정보',
    type: ReportedReviewDto,
    nullable: true,
  })
  lecturerReportedReview?: ReportedReviewDto;

  constructor(LecturerReport: Partial<LecturerReportDto>) {
    super();

    this.id = LecturerReport.id;
    this.reason = LecturerReport.reason;
    this.isAnswered = LecturerReport.isAnswered;
    this.createdAt = LecturerReport.createdAt;
    this.updatedAt = LecturerReport.updatedAt;

    this.reportedLecturer = LecturerReport.reportedLecturer
      ? new LecturerDto(LecturerReport.reportedLecturer)
      : null;

    this.targetUser = LecturerReport.targetUser
      ? new UserDto(LecturerReport.targetUser)
      : null;

    this.targetLecturer = LecturerReport.targetLecturer
      ? new LecturerDto(LecturerReport.targetLecturer)
      : null;

    this.lecturerReportResponse = LecturerReport.lecturerReportResponse
      ? new ReportResponseDto(LecturerReport.lecturerReportResponse)
      : null;

    this.lecturerReportType = LecturerReport.lecturerReportType
      ? LecturerReport.lecturerReportType.map(
          (reportType) => new ReportedTypeDto(reportType),
        )
      : null;

    Object.seal(this);
  }
}
