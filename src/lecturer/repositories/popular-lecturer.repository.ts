import { PrismaTransaction } from '@src/common/interface/common-interface';
import { PrismaService } from '@src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Lecturer } from '@prisma/client';

@Injectable()
export class PopularLecturerRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async trxReadLecturerReservationCount(
    trasaction: PrismaTransaction,
    lecturerId: number,
  ): Promise<number> {
    return await trasaction.reservation.count({
      where: { lectureSchedule: { lecture: { lecturerId } } },
    });
  }

  async trxReadLecturerLikesCount(
    trasaction: PrismaTransaction,
    lecturerId: number,
  ): Promise<number> {
    return await trasaction.likedLecturer.count({ where: { lecturerId } });
  }

  async trxReadLecturerWithUserId(
    transaction: PrismaTransaction,
    lecturerId: number,
  ): Promise<Lecturer> {
    return await transaction.lecturer.findFirst({
      where: { id: lecturerId },
      include: { lecturerProfileImageUrl: true },
    });
  }
}
