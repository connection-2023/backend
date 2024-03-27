import { PrismaService } from '@src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async updateActiveLecture() {
    await this.prismaService.lecture.updateMany({
      where: {
        isActive: true,
        OR: [
          {
            lectureSchedule: { every: { startDateTime: { lte: new Date() } } },
          },
          {
            regularLectureStatus: {
              every: {
                regularLectureSchedule: {
                  every: { startDateTime: { lte: new Date() } },
                },
              },
            },
          },
        ],
      },
      data: { isActive: false },
    });
  }
}
