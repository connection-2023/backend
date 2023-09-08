import { Injectable } from '@nestjs/common';
import { CreateLectureDto } from '../dtos/create-lecture.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LectureService {
  constructor(private readonly prismaService: PrismaService) {}
  async createLecture(
    lecture: CreateLectureDto,
    danceLecturerId: number,
  ): Promise<CreateLectureDto> {
    lecture.reservationDeadline = new Date(lecture.reservationDeadline);
    const newLecture = await this.prismaService.lecture.create({
      data: { danceLecturerId, ...lecture },
    });
    return newLecture;
  }
}
