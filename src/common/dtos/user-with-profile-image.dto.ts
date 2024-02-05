import { Users } from '@prisma/client';
import { UserProfileImageDto } from './user-profile-image.dto';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class UserWithProfileImageDto implements Pick<Users, 'id' | 'nickname'> {
  @ApiProperty({
    type: Number,
    description: '유저 Id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '닉네임',
  })
  @Expose()
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지',
  })
  @Expose()
  profileImageUrl: string;

  userProfileImage: UserProfileImageDto;

  constructor(userWithProfileImage: Partial<UserWithProfileImageDto>) {
    Object.assign(this, userWithProfileImage);

    this.profileImageUrl = userWithProfileImage.userProfileImage
      ? userWithProfileImage.userProfileImage.imageUrl
      : null;
  }
}
