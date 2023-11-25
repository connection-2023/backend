import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from '@src/common/interface/common-interface';
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

  async readManyLikedLectureWithUserId(
    userId: number,
  ): Promise<LikedLecture[]> {
    return await this.prismaService.likedLecture.findMany({
      where: { userId },
      include: { lecture: true },
    });
  }
}
