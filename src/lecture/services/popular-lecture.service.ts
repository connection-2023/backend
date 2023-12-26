import { Injectable } from '@nestjs/common';
import { PopularLectureRepository } from '../repositories/popular-lecture.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { PrismaTransaction } from '@src/common/interface/common-interface';

@Injectable()
export class PopularLectureService {
  constructor(
    private readonly popularLectureRepository: PopularLectureRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async readPopularLectureWithUserId(userId: number) {
    return await this.prismaService.$transaction(
      async (trasaction: PrismaTransaction) => {
        const popularScores = [];
        const lectures = await trasaction.lecture.findMany({
          where: { isActive: true },
          select: { id: true },
        });

        for (const lecture of lectures) {
          const reservationCount =
            await this.popularLectureRepository.trxReadLectureReservationCount(
              trasaction,
              lecture.id,
            );
          const likesCount =
            await this.popularLectureRepository.trxReadLectureLikesCount(
              trasaction,
              lecture.id,
            );
          const popularScore = {
            id: lecture.id,
            reservationCount,
            likesCount,
            score:
              Math.round((reservationCount * 0.6 + likesCount * 0.4) * 100) /
              100,
          };
          popularScores.push(popularScore);
        }

        popularScores.sort((a, b) => {
          if (a.score !== b.score) {
            return b.score - a.score;
          } else {
            return b.reservationCount - a.reservationCount;
          }
        });

        const topFivePopularScores = popularScores.slice(0, 5);
        const popularLectures = [];

        for (const popularLecture of topFivePopularScores) {
          const lecture =
            await this.popularLectureRepository.trxReadLectureWithUserId(
              trasaction,
              popularLecture.id,
              userId,
            );

          popularLectures.push(lecture);
        }

        return popularLectures;
      },
    );
  }
}
