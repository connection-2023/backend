import { LecturerDanceGenre } from '@prisma/client';
import { DanceCategoryDto } from './dance-category.dto';
import { ApiProperty } from '@nestjs/swagger';
import { number, string } from 'joi';

export class LecturerDanceGenreDto implements LecturerDanceGenre {
  id: number;
  danceCategoryId: number;
  lecturerId: number;

  @ApiProperty({
    description: '기타일때 장르 이름',
  })
  name: string;

  @ApiProperty({
    description: '장르',
    type: DanceCategoryDto,
    nullable: true,
  })
  danceCategory: DanceCategoryDto;

  constructor(lecturerDanceGenre: Partial<LecturerDanceGenreDto>) {
    this.danceCategoryId = lecturerDanceGenre.danceCategoryId;
    this.name = lecturerDanceGenre.name;
    this.danceCategory = lecturerDanceGenre.danceCategory
      ? new DanceCategoryDto(lecturerDanceGenre.danceCategory)
      : null;

    Object.assign(this);
  }
}
