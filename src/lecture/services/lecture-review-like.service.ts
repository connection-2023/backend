import { LectureReviewLikeRepository } from './../repositories/lecture-review-like.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LectureReviewLikeService {
  constructor(
    private readonly lectureReviewLikeRepository: LectureReviewLikeRepository,
  ) {}

  async createLectureReviewLike(userId: number, lectureReviewId: number) {
    return await this.lectureReviewLikeRepository.createLectureReviewLike(
      userId,
      lectureReviewId,
    );
  }

  async deleteLectureReviewLike(userId: number, lectureReviewId: number) {
    await this.lectureReviewLikeRepository.deleteLectureReviewLike(
      userId,
      lectureReviewId,
    );
  }
}
