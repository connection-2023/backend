import { UserPass } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { BaseReturnDto } from '@src/common/dtos/base-return.dto';

export class LearnerPassDto extends BaseReturnDto implements UserPass {
  @ApiProperty({
    type: Number,
    description: '유저 패스권 목록 Id',
  })
  id: number;
  userId: number;
  paymentId: number;

  @ApiProperty({
    type: Number,
    description: '남은 횟수',
  })
  remainingUses: number;
  lecturePassId: number;

  @ApiProperty({
    type: Boolean,
    description: '사용가능 여부',
  })
  isEnabled: boolean;

  @ApiProperty({
    type: Date,
    description: '사용 시작일',
  })
  startAt: Date;

  @ApiProperty({
    type: Date,
    description: '종료일',
  })
  endAt: Date;
  deletedAt: Date;

  constructor(userPass: Partial<LearnerPassDto>) {
    super();

    this.id = userPass.id;
    this.remainingUses = userPass.remainingUses;
    this.isEnabled = userPass.isEnabled;
    this.startAt = userPass.startAt;
    this.endAt = userPass.endAt;

    Object.assign(this);
  }
}
