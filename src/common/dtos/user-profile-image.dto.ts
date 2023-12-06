import { ApiProperty } from '@nestjs/swagger';
import { UserProfileImage } from '@prisma/client';

export class UserProfileImageDto implements UserProfileImage {
  id: number;
  userId: number;

  @ApiProperty({
    description: '이미지 url',
  })
  imageUrl: string | null;

  constructor(user: UserProfileImage) {
    this.imageUrl = user.imageUrl;

    Object.seal(this);
  }
}
