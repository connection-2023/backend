import { ApiProperty } from '@nestjs/swagger';
import { Lecture, LectureImage } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class BasicLectureWithImageDto implements Pick<Lecture, 'id' | 'title'> {
  @ApiProperty({
    description: '강의 id',
    type: Number,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '강의 제목',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: '강의 이미지 url',
  })
  @Transform(({ obj }) => obj && obj.lectureImage[0]?.imageUrl, {
    toPlainOnly: true,
  })
  @Expose()
  imageUrl?: string;

  lectureImage?: LectureImage[];
}
