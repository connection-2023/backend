import { ApiProperty } from '@nestjs/swagger';
import { LectureReviewDto } from '@src/common/dtos/lecture-review.dto';
import { Exclude, Expose } from 'class-transformer';
import { ILectureReview } from '../interface/lecture.interface';

@Exclude()
export class CombinedMyReviewWithCountDto {
  @Expose()
  @ApiProperty({
    description: '리뷰 정보',
    type: [LectureReviewDto],
  })
  reviews: LectureReviewDto[];

  @Expose()
  @ApiProperty({ description: '리뷰 수', type: Number })
  totalItemCount: number;

  constructor(reviews: ILectureReview[], totalItemCount: number) {
    Object.assign(this);
    this.reviews = reviews
      ? reviews.map((review) => new LectureReviewDto(review))
      : undefined;
    this.totalItemCount = totalItemCount;
  }
}
