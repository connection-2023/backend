import { PrismaService } from './../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { LectureReviewRepository } from '../repositories/lecture-review.repository';
import { LectureReview } from '@prisma/client';

@Injectable()
export class LectureReviewService {
  constructor(
    private readonly lectureReviewRespository: LectureReviewRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async readManyLectureReview(lectureId: number): Promise<LectureReview[]> {
    return await this.prismaService.lectureReview.findMany({
      where: { lectureId },
      include: { users: { include: { userProfileImage: true } } },
    });
  }
}
