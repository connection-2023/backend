import { ApiProperty } from '@nestjs/swagger';
import { LecturerProfileImageUrl, Users } from '@prisma/client';

export class LecturerProfileImageDto implements LecturerProfileImageUrl {
  id: number;
  lecturerId: number;

  @ApiProperty({
    description: '프로필 이미지 url',
  })
  url: string;

  constructor(lecturerProfileImage: Partial<LecturerProfileImageUrl>) {
    this.url = lecturerProfileImage.url;

    Object.seal(this);
  }
}
