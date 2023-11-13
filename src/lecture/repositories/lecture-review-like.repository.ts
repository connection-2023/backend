import { Injectable } from '@nestjs/common';
import { LikedLectureReview } from '@prisma/client';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class LectureReviewLikeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createLectureReviewLike(
    userId: number,
    lectureReviewId: number,
  ): Promise<LikedLectureReview> {
    return await this.prismaService.likedLectureReview.create({
      data: { userId, lectureReviewId },
    });
  }

  async deleteLectureReviewLike(
    userId: number,
    lectureReviewId: number,
  ): Promise<void> {
    await this.prismaService.likedLectureReview.delete({
      where: { lectureReviewId_userId: { lectureReviewId, userId } },
    });
  }
}
