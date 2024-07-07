import { PrismaService } from '@src/prisma/prisma.service';
import { PopularLecturerRepository } from './../repositories/popular-lecturer.repository';
import { Injectable } from '@nestjs/common';
import { LecturerDto } from '@src/common/dtos/lecturer.dto';

@Injectable()
export class PopularLecturerService {
  constructor(
    private readonly popularLecturerRepository: PopularLecturerRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async readManyPopularLecturer(userId?: number): Promise<LecturerDto[]> {
    const where = { deletedAt: null };

    userId ? (where['blockedLecturer'] = { none: { userId } }) : false;

    const popularScores = [];
    const lecturers = await this.prismaService.lecturer.findMany({
      where,
      select: { id: true },
    });

    for (const lecturer of lecturers) {
      const reservationCount =
        await this.popularLecturerRepository.readLecturerReservationCount(
          lecturer.id,
        );
      const likesCount =
        await this.popularLecturerRepository.readLecturerLikesCount(
          lecturer.id,
        );
      const popularScore = this.createPopularScore(
        lecturer.id,
        reservationCount,
        likesCount,
      );

      popularScores.push(popularScore);
    }

    const sortedPopularScores = this.sortPopularScores(popularScores);

    const topTenPopularScores = sortedPopularScores.slice(0, 10);
    const popularLecturers = [];

    for (const popularLecturer of topTenPopularScores) {
      const lecturer =
        await this.popularLecturerRepository.readLecturerWithLecturerId(
          popularLecturer.id,
        );

      popularLecturers.push(new LecturerDto(lecturer));
    }

    return popularLecturers;
  }

  private createPopularScore(
    lecturerId: number,
    reservationCount: number,
    likesCount: number,
  ) {
    const popularScore = {
      id: lecturerId,
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
