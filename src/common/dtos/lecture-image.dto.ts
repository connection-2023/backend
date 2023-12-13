import { ApiProperty } from '@nestjs/swagger';
import { LectureImage } from '@prisma/client';

export class LectureImageDto implements LectureImage {
  id: number;
  lectureId: number;

  @ApiProperty({
    description: '강의 이미지 url',
  })
  imageUrl: string;

  constructor(lectureImage: Partial<LectureImageDto>) {
    this.id = lectureImage.id;
    this.imageUrl = lectureImage.imageUrl;

    Object.assign(this);
  }
}
