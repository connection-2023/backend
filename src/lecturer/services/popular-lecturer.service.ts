import { PrismaService } from '@src/prisma/prisma.service';
import { PopularLecturerRepository } from './../repositories/popular-lecturer.repository';
import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import { LecturerDto } from '@src/common/dtos/lecturer.dto';

@Injectable()
export class PopularLecturerService {
  constructor(
    private readonly popularLecturerRepository: PopularLecturerRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async readManyPopularLecturer(userId: number): Promise<LecturerDto[]> {
    return await this.prismaService.$transaction(
      async (trasaction: PrismaTransaction) => {
        const popularScores = [];
        const lecturers = await trasaction.lecturer.findMany({
          where: { deletedAt: null, blockedLecturer: { none: { userId } } },
          select: { id: true },
        });

        for (const lecturer of lecturers) {
          const reservationCount =
            await this.popularLecturerRepository.trxReadLecturerReservationCount(
              trasaction,
              lecturer.id,
            );
          const likesCount =
            await this.popularLecturerRepository.trxReadLecturerLikesCount(
              trasaction,
              lecturer.id,
            );
          const popularScore = {
            id: lecturer.id,
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
        const popularLecturers = [];

        for (const popularLecturer of topFivePopularScores) {
          const lecturer =
            await this.popularLecturerRepository.trxReadLecturerWithUserId(
              trasaction,
              popularLecturer.id,
            );

          popularLecturers.push(new LecturerDto(lecturer));
        }

        return popularLecturers;
      },
    );
  }
}
