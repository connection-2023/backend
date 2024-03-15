import { LectureReviewDto } from '@src/common/dtos/lecture-review.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ILectureReview } from '../interface/lecture.interface';

export class CombinedLectureReviewWithCountDto {
  @ApiProperty({
    description: '리뷰 정보',
    type: LectureReviewDto,
    isArray: true,
  })
  reviews: LectureReviewDto[];

  @ApiProperty({ description: '리뷰 수', type: Number })
  totalItemCount: number;

  constructor(lectureReviews: ILectureReview[], count: number) {
    this.reviews = lectureReviews
      ? lectureReviews.map((review) => new LectureReviewDto(review))
      : [];

    this.totalItemCount = count;

    Object.assign(this);
  }
}
