import { Injectable } from '@nestjs/common';
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
    lectures: IEsLecture[],
    gteDate: Date,
    lteDate?: Date,
  ) {
    const formattedGteDate = new Date(gteDate.setHours(9, 0, 0, 0));
    const formattedLteDate = lteDate
      ? new Date(lteDate.setHours(32, 59, 59, 999))
      : new Date(gteDate.setHours(32, 59, 59, 999));

    return await this.prismaService.lectureSchedule.groupBy({
      by: ['lectureId'],
      where: {
        lectureId: {
          in: lectures.map((lecture) => lecture.id),
        },
        startDateTime: {
          gte: formattedGteDate,
          lte: formattedLteDate,
        },
      },
    });
  }
}
