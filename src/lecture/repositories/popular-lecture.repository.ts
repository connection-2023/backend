import { PrismaTransaction } from '@src/common/interface/common-interface';
import { Injectable } from '@nestjs/common';
import { Lecture, Reservation } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class PopularLectureRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async trxReadLectureReservationCount(
    trasaction: PrismaTransaction,
    lectureId: number,
  ): Promise<number> {
    return await trasaction.reservation.count({
      where: { lectureSchedule: { lectureId } },
    });
  }

  async trxReadLectureLikesCount(
    trasaction: PrismaTransaction,
    lectureId: number,
  ): Promise<number> {
    return await trasaction.likedLecture.count({ where: { lectureId } });
  }

  async trxReadLectureWithUserId(
    transaction: PrismaTransaction,
    lectureId: number,
    userId?: number,
  ): Promise<Lecture> {
    const include = {
      lecturer: true,
      lectureToDanceGenre: {
        include: { danceCategory: true },
      },
      lectureToRegion: {
        include: {
          region: true,
        },
      },
      lectureDay: true,
      lectureImage: true,
    };

    userId ? (include['likedLecture'] = { where: { userId } }) : false;

    return await transaction.lecture.findFirst({
      where: { id: lectureId, isActive: true },
      include,
    });
  }

  async trxReadLecture(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<Lecture> {
    return await transaction.lecture.findFirst({
      where: { id: lectureId, isActive: true },
      include: {
        lecturer: true,
        lectureToDanceGenre: {
          include: { danceCategory: true },
        },
        lectureToRegion: {
          include: {
            region: true,
          },
        },
        lectureDay: true,
        lectureImage: true,
      },
    });
  }
}
