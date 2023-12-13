import { UserReport } from '@prisma/client';
import { BaseReturnDto } from '@src/common/dtos/base-return.dto';
import { LecturerDto } from '@src/common/dtos/lecturer.dto';
import { UserDto } from '@src/common/dtos/user.dto';
import { ReportResponseDto } from './report-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ReportedTypeDto } from './user-report-type.dto';
import { ReportedReviewDto } from './reported-review.dto';

export class UserReportDto extends BaseReturnDto implements UserReport {
  @ApiProperty({
    description: '신고 id',
    type: Number,
  })
  id: number;
  reportedUserId: number;
  targetUserId: number | null;
  targetLecturerId: number | null;

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
    description: '신고 한 유저 정보',
    type: UserDto,
  })
  reportedUser?: UserDto;

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
  userReportResponse?: ReportResponseDto;

  @ApiProperty({
    description: '신고 유형',
    type: ReportedTypeDto,
    isArray: true,
  })
  userReportType?: ReportedTypeDto[];

  @ApiProperty({
    description: '신고한 댓글 정보',
    type: ReportedReviewDto,
  })
  userReportedReview?: ReportedReviewDto;

  constructor(userReport: Partial<UserReportDto>) {
    super();

    this.id = userReport.id;
    this.reason = userReport.reason;
    this.isAnswered = userReport.isAnswered;
    this.createdAt = userReport.createdAt;
    this.updatedAt = userReport.updatedAt;

    this.reportedUser = userReport.reportedUser
      ? new UserDto(userReport.reportedUser)
      : null;

    this.targetLecturer = userReport.targetLecturer
      ? new LecturerDto(userReport.targetLecturer)
      : null;

    this.targetUser = userReport.targetUser
      ? new UserDto(userReport.targetUser)
      : null;

    this.userReportResponse = userReport.userReportResponse
      ? new ReportResponseDto(userReport.userReportResponse)
      : null;

    this.userReportType = userReport.userReportType
      ? userReport.userReportType.map(
          (reportType) => new ReportedTypeDto(reportType),
        )
      : null;

    Object.seal(this);
  }
}
