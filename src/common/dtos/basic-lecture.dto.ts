import { ApiProperty } from '@nestjs/swagger';
import { Lecture } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BasicLectureDto implements Pick<Lecture, 'id' | 'title'> {
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
}
