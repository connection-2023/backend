import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';

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
}
