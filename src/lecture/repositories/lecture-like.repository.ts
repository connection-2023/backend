import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import { PrismaService } from '@src/prisma/prisma.service';
import { LectureLikeInputData } from '../interface/lecture.interface';
import { Lecture, LikedLecture } from '@prisma/client';

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

  async getLikedLectureWithUserId(userId: number): Promise<Lecture[]> {
    return await this.prismaService.lecture.findMany({
      where: { likedLecture: { some: { userId } }, deletedAt: null },
      include: {
        lectureImage: true,
        lectureToDanceGenre: {
          include: { danceCategory: true },
        },
        lectureToRegion: { select: { region: true } },
        lectureMethod: { select: { name: true } },
        lecturer: true,
        likedLecture: { where: { userId } },
      },
    });
  }

  async countLikedLectureWithUserId(userId: number): Promise<number> {
    return await this.prismaService.likedLecture.count({
      where: { userId, lecture: { deletedAt: null } },
    });
  }
}
