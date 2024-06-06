import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { LectureLikeInputData } from '../interface/lecture.interface';
import { LikedLecture } from '@prisma/client';

@Injectable()
export class LectureLikeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createLectureLike(
    lectureLikeInputData: LectureLikeInputData,
  ): Promise<LikedLecture> {
    return await this.prismaService.likedLecture.create({
      data: lectureLikeInputData,
    });
  }

  async getLikedLectureWithUserId(userId: number): Promise<LikedLecture[]> {
    return await this.prismaService.likedLecture.findMany({
      where: { userId, lecture: { deletedAt: null } },
      include: {
        lecture: {
          include: {
            lectureImage: true,
            lectureToDanceGenre: {
              include: { danceCategory: true },
            },
            lectureToRegion: { select: { region: true } },
            lectureMethod: { select: { name: true } },
            lecturer: true,
          },
        },
      },
    });
  }

  async countLikedLectureWithUserId(userId: number): Promise<number> {
    return await this.prismaService.likedLecture.count({
      where: { userId, lecture: { deletedAt: null } },
    });
  }

  async findUserLikeLecturesByUserIdAndLecturerId(
    userId: number,
    lecturerId: number,
  ): Promise<LikedLecture[]> {
    return await this.prismaService.likedLecture.findMany({
      where: { userId, lecture: { lecturerId } },
    });
  }

  async deleteUserLikeLectureByUserIdAndLecturerId(
    userId: number,
    lecturerId: number,
  ): Promise<void> {
    await this.prismaService.likedLecture.deleteMany({
      where: { userId, lecture: { lecturerId } },
    });
  }
}
