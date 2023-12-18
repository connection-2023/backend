import { Injectable } from '@nestjs/common';
import { LikedLecturer } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class LecturerLikeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createLecturerLike(
    lecturerId: number,
    userId: number,
  ): Promise<LikedLecturer> {
    return await this.prismaService.likedLecturer.create({
      data: { lecturerId, userId },
    });
  }

  async deleteLecturerLike(lecturerId: number, userId: number): Promise<void> {
    await this.prismaService.likedLecturer.delete({
      where: { lecturerId_userId: { lecturerId, userId } },
    });
  }

  async readManyLecturerLike(userId: number): Promise<LikedLecturer[]> {
    return await this.prismaService.likedLecturer.findMany({
      where: { userId },
      include: {
        lecturer: {
          select: {
            nickname: true,
            affiliation: true,
            stars: true,
            lecturerRegion: { select: { region: true } },
            lecturerDanceGenre: {
              include: { danceCategory: { select: { genre: true } } },
            },
            lecturerProfileImageUrl: { select: { url: true }, take: 1 },
          },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  async getCountLecturerLike(userId: number): Promise<number> {
    return await this.prismaService.likedLecturer.count({ where: { userId } });
  }
}
