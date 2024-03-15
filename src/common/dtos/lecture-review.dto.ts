import { ApiProperty } from '@nestjs/swagger';
import { BaseReturnDto } from './base-return.dto';
import { ReviewUserDto } from '@src/lecture/dtos/read-review-user.dto';
import { ILectureReview } from '@src/lecture/interface/lecture.interface';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class LectureReviewDto extends BaseReturnDto {
  @Expose()
  @ApiProperty({ description: '리뷰 id', type: Number })
  id: number;

  @Expose()
  @ApiProperty({ description: '강의 id', type: Number })
  lectureId: number;

  @Expose()
  @ApiProperty({ description: '유저 id', type: Number })
  userId: number;

  @Expose()
  @ApiProperty({ description: '예약 id', type: Number })
  reservationId: number;

  @Expose()
  @ApiProperty({ description: '별점', type: Number })
  stars: number;

  @Expose()
  @ApiProperty({ description: '리뷰 내용' })
  description: string;

  @Expose()
  @ApiProperty({ description: '유저 정보', type: ReviewUserDto })
  user: ReviewUserDto;

  @Expose()
  @ApiProperty({ description: '강의 제목' })
  lectureTitle: string;

  @Expose()
  @ApiProperty({ description: '수강 시간' })
  startDateTime: Date;

  @Expose()
  @ApiProperty({ description: '좋아요 여부', type: Boolean })
  isLike: boolean;

  @Expose()
  @ApiProperty({ description: '리뷰 좋아요 수', type: Number })
  likeCount: number;

  deletedAt: Date;

  constructor(review: Partial<ILectureReview>) {
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
    this.likeCount = review._count.likedLectureReview;

    Object.assign(this);
  }
}
