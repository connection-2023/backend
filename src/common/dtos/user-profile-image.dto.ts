import { ApiProperty } from '@nestjs/swagger';
import { UserProfileImage } from '@prisma/client';

export class UserProfileImageDto implements UserProfileImage {
  id: number;
  userId: number;

  @ApiProperty({
    example: 'url입니다람쥐',
  })
  imageUrl: string | null;

  constructor(user: UserProfileImage) {
    this.imageUrl = user.imageUrl;

    Object.seal(this);
  }
}
