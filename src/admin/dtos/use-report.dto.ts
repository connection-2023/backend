import { UserReport } from '@prisma/client';
import { BaseReturnDto } from '@src/common/dtos/base-return.dto';
import { LecturerDto } from '@src/common/dtos/lecturer.dto';
import { UserDto } from '@src/common/dtos/user.dto';

export class UserReportDto extends BaseReturnDto implements UserReport {
  id: number;
  reportedUserId: number;
  targetUserId: number | null;
  targetLecturerId: number | null;
  reason: string | null;
  isAnswered: boolean;

  reportedUser: UserDto;
  targetUser: UserDto | null;
  targetLecturer: LecturerDto;
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

    this.targetUser = userReport.targetUser
      ? new UserDto(userReport.targetUser)
      : null;

    Object.seal(this);
  }
}
