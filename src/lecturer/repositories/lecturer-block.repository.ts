import { Injectable } from '@nestjs/common';
import { BlockedLecturer } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class LecturerBlockRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createLecturerBlock(
    lecturerId: number,
    userId: number,
  ): Promise<BlockedLecturer> {
    return await this.prismaService.blockedLecturer.create({
      data: { lecturerId, userId },
    });
  }

  async deleteLecturerBlock(lecturerId: number, userId: number): Promise<void> {
    await this.prismaService.blockedLecturer.delete({
      where: { lecturerId_userId: { lecturerId, userId } },
    });
  }

  async readManyLecturerBlock(userId: number): Promise<BlockedLecturer[]> {
    return await this.prismaService.blockedLecturer.findMany({
      where: { userId },
      include: {
        lecturer: {
          select: {
            nickname: true,
            lecturerProfileImageUrl: { select: { url: true }, take: 1 },
          },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  async getCountLecturerBlock(userId: number): Promise<number> {
    return await this.prismaService.blockedLecturer.count({
      where: { userId },
    });
  }
}
