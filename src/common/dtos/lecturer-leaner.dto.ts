import { LecturerLearner } from '@prisma/client';
import { BaseReturnDto } from './base-return.dto';
import { UserDto } from './user.dto';
import { ReservationDto } from './reservation.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LecturerLearnerDto
  extends BaseReturnDto
  implements LecturerLearner
{
  id: number;
  userId: number;
  lecturerId: number;
  enrollmentCount: number;
  memo: string;

  @ApiProperty({
    description: '유저',
    type: UserDto,
  })
  user?: UserDto;

  @ApiProperty({
    description: '예약 정보',
    type: UserDto,
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
