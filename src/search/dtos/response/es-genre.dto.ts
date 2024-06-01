import { ApiProperty } from '@nestjs/swagger';
import { IEsGenre } from '../../interface/search.interface';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class EsGenreDto {
  @ApiProperty({
    type: Number,
    description: '장르 Id',
  })
  @Expose()
  @Transform(({ obj }) => obj.categoryId, { toClassOnly: true })
  id: number;

  @ApiProperty({
    description: '장르명',
  })
  @Expose()
  genre: string;
}
