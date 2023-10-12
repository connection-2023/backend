import { QueryFilter } from '@src/common/filters/query.filter';
import { PrismaService } from './../../prisma/prisma.service';
import { CreateLectureDto } from '../dtos/create-lecture.dto';
import { Lecture, LectureSchedule } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LectureRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async trxCreateLecture(
    lecturerId: number,
    lecture: CreateLectureDto,
    reservationDeadline: Date,
  ): Promise<Lecture> {
    return await this.prismaService.lecture.create({
      data: {
        lecturerId,
        ...lecture,
        reservationDeadline,
      },
    });
  }

  async trxCreateLectureSchedule(schedule): Promise<any> {
    return await this.prismaService.lectureSchedule.createMany({
      data: [schedule],
    });
  }
}
