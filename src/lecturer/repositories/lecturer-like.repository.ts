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
}
