import { Users, Auth } from '@prisma/client';
import { BaseReturnDto } from './base-return.dto';
import { UserProfileImageDto } from './user-profile-image.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AuthDto } from './auth.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDto extends BaseReturnDto implements Users {
  @ApiProperty({
    description: '유저 Id',
    type: Number,
  })
  @Expose()
  id: number;
  uuid: string;
  name: string;

  @ApiProperty({
    description: '닉네임',
  })
  @Expose()
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
  @Expose()
  userProfileImage?: UserProfileImageDto;

  @ApiProperty({ description: '유저 소셜', type: AuthDto })
  @Expose()
  auth?: AuthDto;

  constructor(user: Partial<UserDto>) {
    super();
    Object.assign(this, user);

    this.auth = user.auth ? new AuthDto(user.auth) : undefined;
    this.userProfileImage = user.userProfileImage
      ? new UserProfileImageDto(user.userProfileImage)
      : null;
  }
}
