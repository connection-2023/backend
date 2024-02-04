import { ApiProperty } from '@nestjs/swagger';
import { UserPass } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
@Exclude()
class PaymentDto {
  @Expose()
  id: number;
}

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

  constructor(lecturerLearnerPassInfo: Partial<LecturerLearnerPassInfoDto>) {
    Object.assign(this, lecturerLearnerPassInfo);
  }
}
