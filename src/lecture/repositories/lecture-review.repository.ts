import { Injectable } from '@nestjs/common';
import { LectureReview, LikedLectureReview } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateLectureReviewDto } from '../dtos/create-lecture-review.dto';
import { UpdateLectureReviewDto } from '../dtos/update-lecture-review.dto';
import { Id, PrismaTransaction } from '@src/common/interface/common-interface';
import { LikedLectureReviewWhereData } from '../interface/lecture.interface';

@Injectable()
export class LectureReviewRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async trxCreateLectureReview(
    transaction: PrismaTransaction,
    userId: number,
    review: CreateLectureReviewDto,
  ): Promise<LectureReview> {
    return await transaction.lectureReview.create({
      data: { userId, ...review },
    });
  }

  async trxIncreaseLectureReviewCount(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<void> {
    await transaction.lecture.update({
      where: { id: lectureId },
      data: { reviewCount: { increment: 1 } },
    });
  }

  async trxDecreaseLectureReviewCount(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<void> {
    await transaction.lecture.update({
      where: { id: lectureId },
      data: { reviewCount: { decrement: 1 } },
    });
  }

  async trxReadManyLectureReviewByLectureWithUserId(
    transaction: PrismaTransaction,
    lectureId: number,
    userId: number,
    order,
  ): Promise<LectureReview[]> {
    return await transaction.lectureReview.findMany({
      where: { lectureId, deletedAt: null },
      include: {
        reservation: {
          select: { lectureSchedule: { select: { startDateTime: true } } },
        },
        users: {
          include: { userProfileImage: { select: { imageUrl: true } } },
        },
        lecture: { select: { title: true } },
        likedLectureReview: { where: { userId } },
        _count: { select: { likedLectureReview: true } },
      },
      orderBy: order,
    });
  }

  async trxReadManyLectureReviewByLecture(
    transaction: PrismaTransaction,
    lectureId: number,
    order,
  ): Promise<LectureReview[]> {
    return await transaction.lectureReview.findMany({
      where: { lectureId, deletedAt: null },
      include: {
        reservation: {
          select: { lectureSchedule: { select: { startDateTime: true } } },
        },
        users: {
          include: { userProfileImage: { select: { imageUrl: true } } },
        },
        lecture: { select: { title: true } },
        _count: { select: { likedLectureReview: true } },
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

  async trxDeleteLectureReview(
    transaction: PrismaTransaction,
    lectureReviewId: number,
  ): Promise<LectureReview> {
    return await transaction.lectureReview.update({
      where: { id: lectureReviewId },
      data: { deletedAt: new Date() },
    });
  }

  async trxGetLectureIdByReview(
    transaction: PrismaTransaction,
    lectureReviewId: number,
  ): Promise<number> {
    const { lectureId } = await transaction.lectureReview.findFirst({
      where: { id: lectureReviewId },
      select: { lectureId: true },
    });

    return lectureId;
  }

  async trxGetLectureReviewLike(
    transaction: PrismaTransaction,
    lectureReviewId: number,
  ): Promise<LikedLectureReview> {
    return await transaction.likedLectureReview.findFirst({
      where: { lectureReviewId },
    });
  }
}
