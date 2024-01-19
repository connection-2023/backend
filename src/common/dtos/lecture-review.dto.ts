import { ApiProperty } from '@nestjs/swagger';
import { BaseReturnDto } from './base-return.dto';
import { ReviewUserDto } from '@src/lecture/dtos/read-review-user.dto';
import { ILectureReivew } from '@src/lecture/interface/lecture.interface';
import { UserDto } from './user.dto';

export class LectureReviewDto extends BaseReturnDto {
  @ApiProperty({ description: '리뷰 id', type: Number })
  id: number;

  @ApiProperty({ description: '강의 id', type: Number })
  lectureId: number;

  @ApiProperty({ description: '유저 id', type: Number })
  userId: number;

  @ApiProperty({ description: '예약 id', type: Number })
  reservationId: number;

  @ApiProperty({ description: '별점', type: Number })
  stars: number;

  @ApiProperty({ description: '리뷰 내용' })
  description: string;

  @ApiProperty({ description: '유저 정보', type: ReviewUserDto })
  user: ReviewUserDto;

  @ApiProperty({ description: '강의 제목' })
  lectureTitle: string;

  @ApiProperty({ description: '수강 시간' })
  startDateTime: Date;

  @ApiProperty({ description: '좋아요 여부', type: Boolean })
  isLike: boolean;

  @ApiProperty({ description: '리뷰 좋아요 수', type: Number })
  count: number;

  deletedAt: Date;

  constructor(review: Partial<ILectureReivew>) {
    super();

    this.id = review.id;
    this.lectureId = review.lectureId;
    this.userId = review.userId;
    this.reservationId = review.reservationId;
    this.stars = review.stars;
    this.description = review.description;
    this.user = new ReviewUserDto(review.users);
    this.lectureTitle = review.lecture.title;
    this.startDateTime = review.reservation.lectureSchedule.startDateTime;
    this.isLike =
      review.likedLectureReview && review.likedLectureReview[0] ? true : false;
    this.count = review._count.likedLectureReview;

    Object.seal(this);
  }
}
