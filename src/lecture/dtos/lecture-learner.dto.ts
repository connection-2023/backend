import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { AuthDto } from '@src/common/dtos/auth.dto';
import { LecturerLearnerDto } from '@src/common/dtos/lecturer-learner.dto';
import { ReservationDto } from '@src/common/dtos/reservation.dto';
import { UserProfileImageDto } from '@src/common/dtos/user-profile-image.dto';
import { UserDto } from '@src/common/dtos/user.dto';
import { Exclude, Expose } from 'class-transformer';
import { object } from 'joi';

@Exclude()
class PrivateUser extends PartialType(
  PickType(UserDto, ['userProfileImage', 'id', 'nickname']),
) {
  constructor(user: Partial<PrivateUser>) {
    super(user);
  }
}

@Exclude()
export class LectureLearnerDto extends OmitType(LecturerLearnerDto, [
  'reservation',
  'user',
  'memo',
]) {
  @ApiProperty({
    description: '유저 정보',
    type: PrivateUser,
  })
  @Expose()
  user: PrivateUser;

  constructor(lectureLearnerDto: Partial<LectureLearnerDto>) {
    super(lectureLearnerDto);
    Object.assign(this, lectureLearnerDto);

    this.user = new PrivateUser(lectureLearnerDto.user);
  }
}
