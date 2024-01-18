import { LecturerLearner } from '@prisma/client';
import { BaseReturnDto } from './base-return.dto';
import { UserDto } from './user.dto';
import { ReservationDto } from './reservation.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LecturerLearnerDto
  extends BaseReturnDto
  implements LecturerLearner
{
  @ApiProperty({
    description: '수강생 목록 Id',
    type: Number,
  })
  id: number;
  userId: number;
  lecturerId: number;

  @ApiProperty({
    description: '수강 횟수 Id',
    type: Number,
  })
  enrollmentCount: number;

  @ApiProperty({
    description: '강사가 작성한 메모',
  })
  memo: string;

  @ApiProperty({
    description: '유저',
    type: UserDto,
  })
  user?: UserDto;

  @ApiProperty({
    description: '예약 정보',
    type: ReservationDto,
  })
  reservation?: ReservationDto;

  constructor(lecturerLearner: Partial<LecturerLearnerDto>) {
    super();
    this.id = lecturerLearner.id;
    this.enrollmentCount = lecturerLearner.enrollmentCount;
    this.memo = lecturerLearner.memo;

    this.user = lecturerLearner.user
      ? new UserDto(lecturerLearner.user)
      : undefined;

    this.reservation = lecturerLearner.reservation
      ? new ReservationDto(lecturerLearner.reservation)
      : undefined;

    Object.seal(this);
  }
}
