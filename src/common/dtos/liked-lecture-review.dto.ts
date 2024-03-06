import { ApiProperty } from '@nestjs/swagger';
import { LikedLectureReview } from '@prisma/client';
import { LectureReviewDto } from './lecture-review.dto';
import { UserDto } from './user.dto';

export class LikedLectureReviewDto implements LikedLectureReview {
  id: number;
  lectureReviewId: number;
  userId: number;
  lectureReview: LectureReviewDto;
  user: UserDto;
}
