import { UserReport } from '@prisma/client';
import { BaseReturnDto } from '@src/common/dtos/base-return.dto';
import { LecturerDto } from '@src/common/dtos/lecturer.dto';
import { UserDto } from '@src/common/dtos/user.dto';
import { ReportResponseDto } from './report-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserReportTypeDto } from './user-report-type.dto';
import { ReportedReviewDto } from './reported-review.dto';

export class UserReportDto extends BaseReturnDto implements UserReport {
  @ApiProperty({
    example: 1,
    type: Number,
  })
  id: number;
  reportedUserId: number;
  targetUserId: number | null;
  targetLecturerId: number | null;

  @ApiProperty({
    example: '춤을 못춰요',
    description: '이유',
    nullable: true,
  })
  reason: string | null;

  @ApiProperty({
    example: false,
    description: '답변 여부',
    type: Boolean,
  })
  isAnswered: boolean;

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
    type: UserReportTypeDto,
    isArray: true,
  })
  userReportType?: UserReportTypeDto[];

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
          (reportType) => new UserReportTypeDto(reportType),
        )
      : null;

    Object.seal(this);
  }
}
