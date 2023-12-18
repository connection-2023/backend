import { Injectable } from '@nestjs/common';
import { LikedLecturer } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class LecturerBlockRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createLecturerBlock(
    lecturerId: number,
    userId: number,
  ): Promise<LikedLecturer> {
    return await this.prismaService.blockedLecturer.create({
      data: { lecturerId, userId },
    });
  }

  async deleteLecturerBlock(lecturerId: number, userId: number): Promise<void> {
    await this.prismaService.blockedLecturer.delete({
      where: { lecturerId_userId: { lecturerId, userId } },
    });
  }
}
