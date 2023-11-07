import { Injectable } from '@nestjs/common';
import { LectureReview } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateLectureReviewDto } from '../dtos/create-lecture-review.dto';
import { UpdateLectureReviewDto } from '../dtos/update-lecture-review.dto';

@Injectable()
export class LectureReviewRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createLectureReview(
    userId: number,
    review: CreateLectureReviewDto,
  ): Promise<LectureReview> {
    return await this.prismaService.lectureReview.create({
      data: { userId, ...review },
    });
  }

  async readManyLectureReviewByLecture(
    lectureId: number,
    order,
  ): Promise<LectureReview[]> {
    return await this.prismaService.lectureReview.findMany({
      where: { lectureId, deletedAt: null },
      include: {
        reservation: {
          select: { lectureSchedule: { select: { startDateTime: true } } },
        },
        users: {
          include: { userProfileImage: { select: { imageUrl: true } } },
        },
        lecture: true,
      },
      orderBy: order,
    });
  }

  async updateLectureReview(
    lectureReviewId: number,
    review: UpdateLectureReviewDto,
  ): Promise<LectureReview> {
    return await this.prismaService.lectureReview.update({
      where: { id: lectureReviewId },
      data: { ...review },
    });
  }

  async deleteLectureReview(lectureReviewId: number): Promise<LectureReview> {
    return await this.prismaService.lectureReview.update({
      where: { id: lectureReviewId },
      data: { deletedAt: new Date() },
    });
  }
}
