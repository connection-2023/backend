import { ApiProperty } from '@nestjs/swagger';
import { LectureReviewDto } from '@src/common/dtos/lecture-review.dto';
import { ILectureReview } from '../interface/lecture.interface';

export class LecturerReviewResultDto {
  @ApiProperty({
    description: '리뷰 정보',
    type: LectureReviewDto,
    isArray: true,
  })
  reviews: LectureReviewDto[];

  @ApiProperty({ description: '리뷰 수', type: Number })
  reviewCount: number;

  constructor(lecturerReviews: {
    reviews?: ILectureReview[];
    reviewCount?: number;
  }) {
    this.reviews = lecturerReviews.reviews
      ? lecturerReviews.reviews.map((review) => new LectureReviewDto(review))
      : [];

    this.reviewCount = lecturerReviews.reviewCount;

    Object.assign(this);
  }
}
