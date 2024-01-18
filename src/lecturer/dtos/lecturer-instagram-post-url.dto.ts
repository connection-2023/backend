import { ApiProperty } from '@nestjs/swagger';
import {
  LecturerInstagramPostUrl,
  LecturerProfileImageUrl,
} from '@prisma/client';

export class LecturerInstagramPostUrlDto implements LecturerInstagramPostUrl {
  id: number;
  lecturerId: number;

  @ApiProperty({
    description: '인스타 url',
  })
  url: string;

  constructor(lecturerProfileImage: Partial<LecturerProfileImageUrl>) {
    this.url = lecturerProfileImage.url;

    Object.seal(this);
  }
}
