import { UserPass } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { LecturePassDto } from './lecture-pass.dto';
import { BaseReturnDto } from './base-return.dto';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

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
  @Type(() => LecturePassDto)
  @Expose()
  lecturePass: LecturePassDto;

  lecturePassId: number;

  constructor(userPass: Partial<UserPassDto>) {
    super();

    Object.assign(this, userPass);
  }
}
