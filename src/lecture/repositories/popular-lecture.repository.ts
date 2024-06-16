import { Injectable } from '@nestjs/common';
import { Lecture, Reservation } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class PopularLectureRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async trxReadLectureReservationCount(lectureId: number): Promise<number> {
    return await this.prismaService.reservation.count({
      where: { lectureSchedule: { lectureId } },
    });
  }

  async trxReadLectureLikesCount(lectureId: number): Promise<number> {
    return await this.prismaService.likedLecture.count({
      where: { lectureId },
    });
  }

  async trxReadLectureWithUserId(
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

    return await this.prismaService.lecture.findFirst({
      where: { id: lectureId, isActive: true },
      include,
    });
  }

  async trxReadLecture(lectureId: number): Promise<Lecture> {
    return await this.prismaService.lecture.findFirst({
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
