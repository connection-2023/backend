import { ApiProperty } from '@nestjs/swagger';
import { DanceCategory } from '@prisma/client';

export class DanceCategoryDto implements DanceCategory {
  @ApiProperty({
    description: '장르 id',
  })
  id: number;

  @ApiProperty({
    description: '장르명',
  })
  genre: string;

  constructor(danceCategory: Partial<DanceCategoryDto>) {
    this.id = danceCategory.id;
    this.genre = danceCategory.genre;

    Object.assign(this);
  }
}
