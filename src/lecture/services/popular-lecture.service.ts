import { Injectable } from '@nestjs/common';
import { PopularLectureRepository } from '../repositories/popular-lecture.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import { LectureDto } from '@src/common/dtos/lecture.dto';

@Injectable()
export class PopularLectureService {
  constructor(
    private readonly popularLectureRepository: PopularLectureRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async readPopularLectureWithUserId(userId?: number): Promise<LectureDto[]> {
    return await this.prismaService.$transaction(
      async (trasaction: PrismaTransaction) => {
        const popularScores = [];
        const lectures = await trasaction.lecture.findMany({
          where: {
            isActive: true,
            lecturer: { blockedLecturer: { none: { userId } } },
          },
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
          const popularScore = this.createPopularScore(
            lecture.id,
            reservationCount,
            likesCount,
          );
          popularScores.push(popularScore);
        }

        const sortedPopularScores = this.sortPopularScores(popularScores);

        const topFivePopularScores = sortedPopularScores.slice(0, 5);

        const popularLectures = [];

        for (const popularLecture of topFivePopularScores) {
          const lecture =
            await this.popularLectureRepository.trxReadLectureWithUserId(
              trasaction,
              popularLecture.id,
              userId,
            );

          popularLectures.push(new LectureDto(lecture));
        }

        return popularLectures;
      },
    );
  }

  async readPopularLecture(): Promise<LectureDto[]> {
    return await this.prismaService.$transaction(
      async (trasaction: PrismaTransaction) => {
        const popularScores = [];
        const lectures = await trasaction.lecture.findMany({
          where: {
            isActive: true,
            deletedAt: null,
          },
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
          const popularScore = this.createPopularScore(
            lecture.id,
            reservationCount,
            likesCount,
          );
          popularScores.push(popularScore);
        }

        const sortedPopularScores = this.sortPopularScores(popularScores);

        const topFivePopularScores = sortedPopularScores.slice(0, 5);

        const popularLectures = [];

        for (const popularLecture of topFivePopularScores) {
          const lecture = await this.popularLectureRepository.trxReadLecture(
            trasaction,
            popularLecture.id,
          );

          popularLectures.push(new LectureDto(lecture));
        }

        return popularLectures;
      },
    );
  }

  private createPopularScore(
    lectureId: number,
    reservationCount: number,
    likesCount: number,
  ) {
    const popularScore = {
      id: lectureId,
      reservationCount,
      likesCount,
      score:
        Math.round((reservationCount * 0.6 + likesCount * 0.4) * 100) / 100,
    };

    return popularScore;
  }

  private sortPopularScores(popularScores) {
    popularScores.sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      } else {
        return b.reservationCount - a.reservationCount;
      }
    });

    return popularScores;
  }
}
