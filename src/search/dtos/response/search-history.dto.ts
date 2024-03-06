import { ApiProperty } from '@nestjs/swagger';
import { SearchHistory } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SearchHistoryDto
  implements Pick<SearchHistory, 'id' | 'searchTerm' | 'updatedAt'>
{
  @ApiProperty({
    type: Number,
    description: '검색 기록 Id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '검색어',
  })
  @Expose()
  searchTerm: string;

  @ApiProperty({
    type: Date,
    description: '검색 시간',
  })
  @Expose()
  updatedAt: Date;

  constructor(searchHistory: Partial<SearchHistoryDto> = {}) {
    Object.assign(this, searchHistory);
  }
}
