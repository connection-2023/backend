import { Lecturer } from '@prisma/client';
import { BaseReturnDto } from './base-return.dto';
import { UserDto } from './user.dto';
import { LecturerProfileImageDto } from './lecturer-profile-image.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LecturerDto extends BaseReturnDto implements Lecturer {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: '닉네임',
  })
  nickname: string;

  @ApiProperty({ description: '강사 카드 이미지' })
  profileCardImageUrl: string;

  userId: number;
  email: string;
  phoneNumber: string;
  youtubeUrl: string;
  instagramUrl: string;
  homepageUrl: string;
  affiliation: string;
  introduction: string;
  experience: string;
  stars: number;
  reviewCount: number;
  deletedAt: Date;

  user?: UserDto;

  @ApiProperty({
    description: '강사의 프로필 이미지들',
    type: LecturerProfileImageDto,
  })
  lecturerProfileImageUrl?: LecturerProfileImageDto[];

  constructor(lecturer: Partial<LecturerDto>) {
    super();

    this.id = lecturer.id;
    this.nickname = lecturer.nickname;
    this.profileCardImageUrl = lecturer.profileCardImageUrl;

    this.user = lecturer.user ? new UserDto(lecturer.user) : undefined;

    this.lecturerProfileImageUrl = lecturer.lecturerProfileImageUrl
      ? lecturer.lecturerProfileImageUrl.map(
          (lecturerProfile) => new LecturerProfileImageDto(lecturerProfile),
        )
      : undefined;

    Object.seal(this);
  }
}
