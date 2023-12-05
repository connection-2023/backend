import { Users } from '@prisma/client';
import { BaseReturnDto } from './base-return.dto';
import { UserProfileImageDto } from './user-profile-image.dto';

export class UserDto extends BaseReturnDto implements Users {
  id: number;
  uuid: string;
  name: string;
  nickname: string;
  email: string;
  isProfileOpen: boolean;
  phoneNumber: string | null;
  gender: number | null;
  deletedAt: Date;

  userProfileImage: UserProfileImageDto;

  constructor(user: Partial<UserDto>) {
    super();

    this.id = user.id;
    this.nickname = user.nickname;

    this.userProfileImage = user.userProfileImage
      ? new UserProfileImageDto(user.userProfileImage)
      : null;

    Object.seal(this);
  }
}
