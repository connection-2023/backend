import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@src/common/dtos/user.dto';
import { uuid } from 'aws-sdk/clients/customerprofiles';

export class ReviewUserDto {
  id: number;
  uuid: uuid;
  isProfileOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  @ApiProperty({ description: '닉네임' })
  nickname: string;

  @ApiProperty({ description: '프로필 이미지' })
  profileImage: string;

  constructor(user: Partial<UserDto>) {
    this.nickname = user.nickname;
    this.profileImage = user.userProfileImage.imageUrl;

    Object.assign(this);
  }
}
