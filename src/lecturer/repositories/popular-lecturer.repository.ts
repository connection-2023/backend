import { PrismaTransaction } from '@src/common/interface/common-interface';
import { PrismaService } from '@src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Lecturer } from '@prisma/client';

@Injectable()
export class PopularLecturerRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async trxReadLecturerReservationCount(lecturerId: number): Promise<number> {
    return await this.prismaService.reservation.count({
      where: { lectureSchedule: { lecture: { lecturerId } } },
    });
  }

  async trxReadLecturerLikesCount(lecturerId: number): Promise<number> {
    return await this.prismaService.likedLecturer.count({
      where: { lecturerId },
    });
  }

  async trxReadLecturerWithLecturerId(lecturerId: number): Promise<Lecturer> {
    return await this.prismaService.lecturer.findFirst({
      where: { id: lecturerId },
      include: { lecturerProfileImageUrl: true },
    });
  }
}
