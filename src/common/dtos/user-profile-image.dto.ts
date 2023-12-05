import { UserProfileImage } from '@prisma/client';

export class UserProfileImageDto implements UserProfileImage {
  id: number;
  userId: number;
  imageUrl: string | null;

  constructor(user: UserProfileImage) {
    this.imageUrl = user.imageUrl;

    Object.seal(this);
  }
}
