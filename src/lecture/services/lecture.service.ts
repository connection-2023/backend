import { Injectable } from '@nestjs/common';
import { CreateLectureDto } from '../dtos/create-lecture.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Lecture } from '@prisma/client';

@Injectable()
export class LectureService {
  constructor(private readonly prisma: PrismaService) {}
  async createLecture(
    lecture: CreateLectureDto,
    danceLecturerId: number,
  ): Promise<Lecture> {
    const newLecture = await this.prisma.lecture.create({
      data: {
        danceLecturerId,
        ...lecture,
        lecturer: {
          connect: {
            id: danceLecturerId,
          },
        },
      },
    });
    return newLecture;
  }
}
