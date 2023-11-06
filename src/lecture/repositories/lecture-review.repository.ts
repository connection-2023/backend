import { Injectable } from '@nestjs/common';
import { LectureReview } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class LectureReviewRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async readManyLectureReviewByLecture(
    lectureId: number,
    order,
  ): Promise<LectureReview[]> {
    return await this.prismaService.lectureReview.findMany({
      where: { lectureId },
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
}
