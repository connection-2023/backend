import { QueryFilter } from '@src/common/filters/query.filter';
import { PrismaService } from './../../prisma/prisma.service';
import { CreateLectureDto } from '../dtos/create-lecture.dto';
import { Lecture, LectureImage, LectureSchedule } from '@prisma/client';
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
    lectureSchedule,
  ): Promise<LectureSchedule[]> {
    await transaction.lectureSchedule.createMany({
      data: lectureSchedule,
    });
    return await transaction.lectureSchedule.findMany({
      where: { lectureId: lectureSchedule.lectureId },
    });
  }

  async trxCreateLectureImg(
    transaction: PrismaTransaction,
    lectureImg,
  ): Promise<LectureImage[]> {
    await transaction.lectureImage.createMany({
      data: lectureImg,
    });
    return await transaction.lectureImage.findMany({
      where: { lectureId: lectureImg.lectureId },
    });
  }
}
