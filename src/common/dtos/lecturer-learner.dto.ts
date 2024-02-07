import { LecturerLearner } from '@prisma/client';
import { BaseReturnDto } from './base-return.dto';
import { UserDto } from './user.dto';
import { ReservationDto } from './reservation.dto';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserProfileImageDto } from './user-profile-image.dto';
@Exclude()
class LecturerLearnerPrivateUserDto extends PickType(UserDto, [
  'id',
  'nickname',
  'phoneNumber',
]) {
  @ApiProperty({
    description: '전화번호',
  })
  @Expose()
  phoneNumber: string;

  @ApiProperty({
    type: String,
    description: '프로필 이미지',
  })
  @Expose()
  userProfileImage?: UserProfileImageDto | string;

  constructor(user: Partial<LecturerLearnerPrivateUserDto>) {
    super();

    Object.assign(this, user);
    console.log(user);

    this.userProfileImage =
      user.userProfileImage && typeof user.userProfileImage !== 'string'
        ? user.userProfileImage.imageUrl
        : null;
  }
}
@Exclude()
export class LecturerLearnerDto
  extends BaseReturnDto
  implements LecturerLearner
{
  @ApiProperty({
    description: '수강생 목록 Id',
    type: Number,
  })
  @Expose()
  id: number;
  userId: number;
  lecturerId: number;

  @ApiProperty({
    description: '수강 횟수 Id',
    type: Number,
  })
  @Expose()
  enrollmentCount: number;

  @ApiProperty({
    description: '강사가 작성한 메모',
  })
  @Expose()
  memo: string;

  @ApiProperty({
    description: '유저',
    type: LecturerLearnerPrivateUserDto,
  })
  @Expose()
  user?: LecturerLearnerPrivateUserDto;

  @ApiProperty({
    description: '예약 정보',
    type: ReservationDto,
  })
  @Expose()
  reservation?: ReservationDto;

  constructor(lecturerLearner: Partial<LecturerLearnerDto>) {
    super();
    Object.assign(this, lecturerLearner);

    this.user = lecturerLearner.user
      ? new LecturerLearnerPrivateUserDto(lecturerLearner.user)
      : undefined;

    this.reservation = lecturerLearner.reservation
      ? new ReservationDto(lecturerLearner.reservation)
      : undefined;
  }
}
