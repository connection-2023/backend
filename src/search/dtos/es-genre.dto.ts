import { ApiProperty } from '@nestjs/swagger';
import { IEsGenre } from '../interface/search.interface';

export class EsGenreDto {
  @ApiProperty({
    type: Number,
    description: '장르 Id',
  })
  id: number;

  @ApiProperty({
    description: '장르명',
  })
  genre: string;

  constructor(genre: Partial<IEsGenre>) {
    this.id = genre.categoryId;
    this.genre = genre.genre;

    Object.assign(this);
  }
}
