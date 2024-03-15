import { ApiProperty } from '@nestjs/swagger';
import { PopularSearch } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PopularSearchTermDto implements PopularSearch {
  @ApiProperty({
    type: Number,
    description: '인기 검색어 id',
  })
  @Expose()
  id: number;
  @ApiProperty({
    description: '검색어',
  })
  @Expose()
  searchTerm: string;
  @ApiProperty({
    type: Number,
    description: '검색 횟수',
  })
  @Expose()
  searchCount: number;
}
