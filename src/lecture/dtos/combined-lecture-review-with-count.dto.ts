import { LectureReviewDto } from '@src/common/dtos/lecture-review.dto';
import { ILectureReview } from '../interface/lecture.interface';
import { LecturerReviewResultDto } from './read-lecturer-review.dto';

export class CombinedLectureReviewWithCountDto extends LecturerReviewResultDto {
  // constructor(lectureReviews: {
  //   reviews?: ILectureReview[];
  //   reviewCount?: number;
  // }) {
  //   super(lectureReviews);
  //   this.reviews = lectureReviews.reviews
  //     ? lectureReviews.reviews.map((review) => new LectureReviewDto(review))
  //     : [];
  //   this.reviewCount = lectureReviews.reviewCount;
  //   Object.assign(this);
  // }
}
