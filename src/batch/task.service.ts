import { PrismaService } from '@src/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly prismaService: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async updateActiveLecture() {
    const closedLecture = await this.prismaService.lecture.updateMany({
      where: {
        isActive: true,
        lectureSchedule: { every: { startDateTime: { lte: new Date() } } },
        regularLectureStatus: {
          every: {
            regularLectureSchedule: {
              every: { startDateTime: { lte: new Date() } },
            },
          },
        },
      },
      data: { isActive: false },
    });

    this.logger.log('closedLecture', closedLecture);
  }
}
