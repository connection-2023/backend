import { Injectable } from '@nestjs/common';
import { TemporaryWeek, Week } from '@src/common/enum/enum';
import { PrismaService } from '@src/prisma/prisma.service';
import { IEsLecture } from '@src/search/interface/search.interface';

@Injectable()
export class SearchRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserLikedLecturerList(userId: number) {
    return await this.prismaService.likedLecturer.findMany({
      where: { userId },
    });
  }

  async getUserblockedLecturerList(userId: number) {
    return await this.prismaService.blockedLecturer.findMany({
      where: { userId },
    });
  }

  async getUserLikedLectureList(userId: number) {
    return await this.prismaService.likedLecture.findMany({
      where: { userId },
    });
  }

  async getLecturesByDate(
    lectureId: number,
    gteDate: Date,
    lteDate?: Date,
    days?: Week[],
  ) {
    return await this.prismaService.lectureSchedule.findFirst({
      where: {
        lectureId,
        AND: {
          startDateTime: {
            gte: gteDate,
            lte: lteDate,
          },
          day: { in: days },
        },
      },
      select: {
        lectureId: true,
      },
    });
  }

  async getRegularLecturesByDate(
    lectureId: number,
    gteDate: Date,
    lteDate?: Date,
    days?: TemporaryWeek[],
  ) {
    return await this.prismaService.regularLectureStatus.findFirst({
      where: {
        lectureId,
        AND: {
          regularLectureSchedule: {
            some: {
              startDateTime: {
                gte: gteDate,
                lte: lteDate,
              },
            },
          },
          day: { hasSome: days },
        },
      },
      select: {
        lectureId: true,
      },
    });
  }
}
