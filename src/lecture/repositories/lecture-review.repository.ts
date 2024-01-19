import { Injectable } from '@nestjs/common';
import { LectureReview, LikedLectureReview, Reservation } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateLectureReviewDto } from '../dtos/create-lecture-review.dto';
import { UpdateLectureReviewDto } from '../dtos/update-lecture-review.dto';
import {
  ICursor,
  PrismaTransaction,
} from '@src/common/interface/common-interface';

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

  async trxIncreaseLectureStars(
    transaction: PrismaTransaction,
    lectureId: number,
    stars: number,
  ): Promise<void> {
    await transaction.lecture.update({
      where: { id: lectureId },
      data: { stars },
    });
  }

  async trxIncreaseLecturerStars(
    transaction: PrismaTransaction,
    lecturerId: number,
    stars: number,
  ): Promise<void> {
    await transaction.lecturer.update({
      where: { id: lecturerId },
      data: { stars },
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

  async trxIncreaseLecturerReviewCount(
    transaction: PrismaTransaction,
    lecturerId: number,
  ): Promise<void> {
    await transaction.lecturer.update({
      where: { id: lecturerId },
      data: { reviewCount: { increment: 1 } },
    });
  }

  async trxDecreaseLectureStars(
    transaction: PrismaTransaction,
    lectureId: number,
    stars: number,
  ): Promise<void> {
    await transaction.lecture.update({
      where: { id: lectureId },
      data: { stars },
    });
  }

  async trxDecreaseLecturerStars(
    transaction: PrismaTransaction,
    lecturerId: number,
    stars: number,
  ): Promise<void> {
    await transaction.lecturer.update({
      where: { id: lecturerId },
      data: { stars },
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

  async trxDecreaseLecturerReviewCount(
    transaction: PrismaTransaction,
    lecturerId: number,
  ): Promise<void> {
    await transaction.lecturer.update({
      where: { id: lecturerId },
      data: { reviewCount: { decrement: 1 } },
    });
  }

  async readManyLectureReviewByLectureWithUserId(
    lectureId: number,
    order,
    userId?: number,
  ): Promise<LectureReview[]> {
    const include = {
      reservation: {
        include: { lectureSchedule: true },
      },
      users: {
        include: { userProfileImage: true },
      },
      lecture: true,
      _count: { select: { likedLectureReview: true } },
    };

    userId ? (include['likedLectureReview'] = { where: { userId } }) : false;

    return await this.prismaService.lectureReview.findMany({
      where: { lectureId, deletedAt: null },
      include,
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

  async readManyMyReviewWithUserId(
    userId: number,
    orderBy,
  ): Promise<LectureReview[]> {
    return await this.prismaService.lectureReview.findMany({
      where: { userId },
      include: {
        lecture: true,
        reservation: {
          select: {
            lectureSchedule: { select: { startDateTime: true } },
          },
        },
        likedLectureReview: { where: { userId } },
        _count: { select: { likedLectureReview: true } },
      },
      orderBy,
    });
  }

  async readManyReservationThatCanBeCreated(
    userId: number,
  ): Promise<Reservation[]> {
    return await this.prismaService.reservation.findMany({
      where: {
        userId: userId,
        lectureReview: null,
      },
      include: {
        lectureSchedule: {
          select: {
            lecture: { select: { id: true, title: true } },
            startDateTime: true,
          },
        },
      },
      orderBy: { lectureSchedule: { startDateTime: 'desc' } },
    });
  }

  async readManyMyReviewWithLecturerId(
    where,
    orderBy,
    take: number,
    cursor?: ICursor,
    skip?: number,
  ): Promise<LectureReview[]> {
    return await this.prismaService.lectureReview.findMany({
      where,
      take,
      skip,
      cursor,
      include: {
        reservation: {
          select: {
            lectureSchedule: {
              select: {
                startDateTime: true,
                lecture: { select: { title: true } },
              },
            },
          },
        },
        users: {
          select: {
            nickname: true,
            userProfileImage: { select: { imageUrl: true } },
          },
        },
      },
      orderBy,
    });
  }

  async readManyMyReviewCountWithLecturerId(
    lecturerId: number,
  ): Promise<number> {
    return await this.prismaService.lectureReview.count({
      where: { lecture: { lecturerId } },
    });
  }

  async readManyLecturerReviewWithUserId(
    lecturerId: number,
    userId: number,
    take: number,
    orderBy,
    cursor?: ICursor,
    skip?: number,
  ): Promise<LectureReview[]> {
    return await this.prismaService.lectureReview.findMany({
      where: { lecture: { lecturerId } },
      take,
      skip,
      cursor,
      include: {
        reservation: {
          select: {
            lectureSchedule: {
              select: {
                startDateTime: true,
                lecture: { select: { title: true } },
              },
            },
          },
        },
        users: {
          select: {
            nickname: true,
            userProfileImage: { select: { imageUrl: true } },
          },
        },
        likedLectureReview: { where: { userId } },
        _count: { select: { likedLectureReview: true } },
      },
      orderBy,
    });
  }

  async readManyLecturerReview(
    lecturerId: number,
    take: number,
    orderBy,
    cursor?: ICursor,
    skip?: number,
  ): Promise<LectureReview[]> {
    return await this.prismaService.lectureReview.findMany({
      where: { lecture: { lecturerId } },
      take,
      skip,
      cursor,
      include: {
        reservation: {
          select: {
            lectureSchedule: {
              select: {
                startDateTime: true,
                lecture: { select: { title: true } },
              },
            },
          },
        },
        users: {
          select: {
            nickname: true,
            userProfileImage: { select: { imageUrl: true } },
          },
        },
        _count: { select: { likedLectureReview: true } },
      },
      orderBy,
    });
  }
}
