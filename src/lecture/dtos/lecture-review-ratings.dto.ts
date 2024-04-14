import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LectureReviewRatingsDto {
  @Expose()
  @ApiProperty({ description: '별점', type: Number })
  stars: number;

  @Expose()
  @ApiProperty({ description: '수', type: Number })
  count: number;

  constructor(ratings: Partial<LectureReviewRatingsDto>) {
    Object.assign(this, ratings);
  }
}
