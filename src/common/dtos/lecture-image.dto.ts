import { ApiProperty } from '@nestjs/swagger';
import { LectureImage } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LectureImageDto implements LectureImage {
  id: number;
  lectureId: number;

  @ApiProperty({
    description: '강의 이미지 url',
  })
  @Expose()
  imageUrl: string;

  constructor(lectureImage: Partial<LectureImageDto>) {
    Object.assign(this, lectureImage);
  }
}
