import { ApiProperty } from '@nestjs/swagger';
import { UserPass } from '@prisma/client';
import { LecturePassDto } from '@src/common/dtos/lecture-pass.dto';
import { Exclude, Expose, Type } from 'class-transformer';
@Exclude()
export class LecturerLearnerPassInfoDto
  implements Pick<UserPass, 'startAt' | 'endAt' | 'remainingUses'>
{
  @ApiProperty({
    type: Number,
    description: '남은 횟수',
  })
  @Expose()
  remainingUses: number;

  @ApiProperty({
    type: Date,
    description: '사용 시작일',
  })
  @Expose()
  startAt: Date;

  @ApiProperty({
    type: Date,
    description: '종료일',
  })
  @Expose()
  endAt: Date;

  @ApiProperty({
    type: LecturePassDto,
    description: '패스권 정보',
  })
  @Expose()
  @Type(() => LecturePassDto)
  lecturePass: LecturePassDto;

  constructor(lecturerLearnerPassInfo: Partial<LecturerLearnerPassInfoDto>) {
    Object.assign(this, lecturerLearnerPassInfo);
  }
}
