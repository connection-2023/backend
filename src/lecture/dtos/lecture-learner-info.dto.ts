import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { LecturerLearner, Reservation } from '@prisma/client';
import { BaseReturnDto } from '@src/common/dtos/base-return.dto';
import { UserProfileImageDto } from '@src/common/dtos/user-profile-image.dto';
import { UserDto } from '@src/common/dtos/user.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
class PrivateUser extends PartialType(
  PickType(UserDto, ['userProfileImage', 'nickname']),
) {
  @Expose()
  userProfileImage: UserProfileImageDto;
  @Expose()
  nickname: string;

  constructor(user: Partial<PrivateUser>) {
    super();

    Object.assign(this, user);
  }
}

@Exclude()
export class LectureLearnerInfoDto
  extends BaseReturnDto
  implements Reservation, LecturerLearner
{
  @ApiProperty({
    type: Number,
    description: '수강생 목록 Id',
  })
  @Expose()
  id: number;

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
    description: '예약 대표자',
  })
  @Expose()
  representative: string;

  @ApiProperty({
    description: '전화 번호',
  })
  @Expose()
  phoneNumber: string;

  @ApiProperty({
    type: Number,
    description: '수강 인원',
  })
  @Expose()
  participants: number;

  @ApiProperty({
    description: '요청 사항',
  })
  @Expose()
  requests: string;

  @ApiProperty({
    type: Number,
    description: '수강 횟수',
  })
  @Expose()
  enrollmentCount: number;

  @ApiProperty({
    description: '강사가 작성한 메모',
  })
  @Expose()
  memo: string;

  lectureId: number;
  paymentId: number;
  lectureScheduleId: number;
  regularLectureStatusId: number;
  isEnabled: boolean;
  lecturerId: number;
  user: PrivateUser;

  constructor(lectureLearnerDto: Partial<LectureLearnerInfoDto>) {
    super();
    Object.assign(this, lectureLearnerDto);

    this.user = new PrivateUser(lectureLearnerDto.user);
    this.nickname = this.user.nickname;
    this.userProfileImage = this.user.userProfileImage
      ? this.user.userProfileImage.imageUrl
      : null;
  }
}
