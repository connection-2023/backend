import { UserPass } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { LecturePassDto } from './lecture-pass.dto';
import { BaseReturnDto } from './base-return.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserPassDto extends BaseReturnDto implements UserPass {
  @ApiProperty({
    type: Number,
    description: '유저 패스권 목록 Id',
  })
  @Expose()
  id: number;
  userId: number;
  paymentId: number;

  @ApiProperty({
    type: Number,
    description: '남은 횟수',
  })
  @Expose()
  remainingUses: number;
  lecturePassId: number;

  @ApiProperty({
    type: Boolean,
    description: '사용가능 여부',
  })
  @Expose()
  isEnabled: boolean;

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
  deletedAt: Date;

  @ApiProperty({
    type: LecturePassDto,
    description: '패스권 정보',
  })
  @Expose()
  lecturePass: LecturePassDto;

  constructor(userPass: Partial<UserPassDto>) {
    super();

    this.id = userPass.id;
    this.remainingUses = userPass.remainingUses;
    this.isEnabled = userPass.isEnabled;
    this.startAt = userPass.startAt;
    this.endAt = userPass.endAt;

    this.lecturePass = userPass.lecturePass
      ? new LecturePassDto(userPass.lecturePass)
      : null;

    Object.assign(this);
  }
}
