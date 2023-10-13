import { QueryFilter } from '@src/common/filters/query.filter';
import { PrismaService } from './../../prisma/prisma.service';
import { CreateLectureDto } from '../dtos/create-lecture.dto';
import { Lecture, LectureSchedule } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from '@src/common/interface/common-interface';

@Injectable()
export class LectureRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async trxCreateLecture(
    transaction: PrismaTransaction,
    lecturerId: number,
    lecture: LectureInputData,
  ): Promise<Lecture> {
    return await transaction.lecture.create({
      data: {
        lecturerId,
        ...lecture,
      },
    });
  }

  async trxCreateLectureSchedule(
    transaction: PrismaTransaction,
    schedule,
  ): Promise<LectureSchedule[]> {
    await transaction.lectureSchedule.createMany({
      data: schedule,
    });
    return await transaction.lectureSchedule.findMany({
      where: { lectureId: schedule.lectureId },
    });
  }
}
