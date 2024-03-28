import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { LecturerLearner, Reservation } from '@prisma/client';
import { BaseReturnDto } from '@src/common/dtos/base-return.dto';
import { UserProfileImageDto } from '@src/common/dtos/user-profile-image.dto';
import { UserDto } from '@src/common/dtos/user.dto';
import { Exclude, Expose, Transform } from 'class-transformer';

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
    type: Boolean,
    description: '활성화 여부',
  })
  @Expose()
  isEnabled: boolean;

  @ApiProperty({
    description: '예약 대표자',
  })
  @Expose()
  representative: string;

  @ApiProperty({
    description: '요청 사항',
  })
  @Expose()
  requests: string;

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
    type: Number,
    description: '수강 횟수',
  })
  @Transform(({ value }) => value || null)
  @Expose()
  enrollmentCount: number;

  @ApiProperty({
    description: '강사가 작성한 메모',
  })
  @Transform(({ value }) => value || null)
  @Expose()
  memo: string;

  lectureId: number;
  paymentId: number;
  lectureScheduleId: number;
  regularLectureStatusId: number;
  lecturerId: number;
}
