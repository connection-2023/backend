import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { LecturerLearnerDto } from '@src/common/dtos/lecturer-learner.dto';
import { UserDto } from '@src/common/dtos/user.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
class PrivateUser extends PartialType(
  PickType(UserDto, ['id', 'userProfileImage', 'nickname', 'phoneNumber']),
) {
  constructor(user: Partial<PrivateUser>) {
    super();

    Object.assign(this, user);
  }
}

@Exclude()
export class LectureLearnerDto extends OmitType(LecturerLearnerDto, [
  'reservation',
  'user',
  'memo',
]) {
  @ApiProperty({
    type: Number,
    description: '유저 Id',
  })
  @Expose()
  userId: number;

  @ApiProperty({
    description: '닉네임',
  })
  @Expose()
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지 url',
  })
  @Expose()
  userProfileImage: string;

  @ApiProperty({
    description: '전화번호',
  })
  @Expose()
  phoneNumber: string;

  user: PrivateUser;

  constructor(lectureLearnerDto: Partial<LectureLearnerDto>) {
    super(lectureLearnerDto);

    Object.assign(this, lectureLearnerDto);

    this.user = new PrivateUser(lectureLearnerDto.user);
    this.userId = this.user.id;
    this.nickname = this.user.nickname;
    this.phoneNumber = this.user.phoneNumber;
    this.userProfileImage = this.user.userProfileImage
      ? this.user.userProfileImage.imageUrl
      : null;
  }
}
