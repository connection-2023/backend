import { Injectable } from '@nestjs/common';
import { TemporaryLecture } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class LectureTemporarilySaveService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTemporaryLecture(lecturerId: number): Promise<TemporaryLecture> {
    return await this.prismaService.temporaryLecture.create({
      data: { lecturerId },
    });
  }
}
