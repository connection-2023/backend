import { Users, Auth } from '@prisma/client';
import { BaseReturnDto } from './base-return.dto';
import { UserProfileImageDto } from './user-profile-image.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AuthDto } from './auth.dto';

export class UserDto extends BaseReturnDto implements Users {
  @ApiProperty({
    description: '유저 Id',
    type: Number,
  })
  id: number;
  uuid: string;
  name: string;

  @ApiProperty({
    description: '닉네임',
  })
  nickname: string;
  email: string;
  isProfileOpen: boolean;
  phoneNumber: string | null;
  gender: number | null;
  deletedAt: Date;

  @ApiProperty({
    description: '유저 프로필 이미지',
    type: UserProfileImageDto,
  })
  userProfileImage?: UserProfileImageDto;

  @ApiProperty({ description: '유저 소셜', type: AuthDto })
  auth?: AuthDto;

  constructor(user: Partial<UserDto>) {
    super();

    this.auth = new AuthDto(user.auth);
    this.userProfileImage = user.userProfileImage
      ? new UserProfileImageDto(user.userProfileImage)
      : null;

    Object.seal(this);
  }
}
