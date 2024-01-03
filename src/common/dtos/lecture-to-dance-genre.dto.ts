import { LectureToDanceGenre } from '@prisma/client';
import { DanceCategoryDto } from './dance-category.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LectureToDanceGenreDto implements LectureToDanceGenre {
  id: number;
  danceCategoryId: number;
  lectureId: number;

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

  constructor(lectureToDanceGenre: Partial<LectureToDanceGenreDto>) {
    this.danceCategoryId = lectureToDanceGenre.danceCategoryId;
    this.name = lectureToDanceGenre.name;
    this.danceCategory = lectureToDanceGenre.danceCategory
      ? new DanceCategoryDto(lectureToDanceGenre.danceCategory)
      : null;

    Object.assign(this);
  }
}
