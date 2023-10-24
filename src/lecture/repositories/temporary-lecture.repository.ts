import { PrismaService } from '@src/prisma/prisma.service';
import { Lecture, Region, TemporaryLectureSchedule } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaTransaction, Id } from '@src/common/interface/common-interface';
import {
  LectureHolidayInputData,
  LectureImageInputData,
  LectureInputData,
  LectureScheduleInputData,
  LectureToDanceGenreInputData,
  LectureToRegionInputData,
} from '@src/lecture/interface/lecture.interface';
import { TemporaryLectureScheduleInputData } from '../interface/temporary-lecture.interface';

@Injectable()
export class LectureRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async trxUpdateTemporaryLecture(
    transaction: PrismaTransaction,
    lecturerId: number,
    lectureId: number,
    lectureMethodId: number,
    lectureTypeId: number,
    lecture: LectureInputData,
  ): Promise<Lecture> {
    return await transaction.lecture.update({
      where: { id: lectureId },
      data: { lecturerId, lectureMethodId, lectureTypeId, ...lecture },
    });
  }

  async trxCreateTemporaryLectureSchedule(
    transaction: PrismaTransaction,
    temporaryLectureSchedule: TemporaryLectureScheduleInputData[],
  ): Promise<void> {
    await transaction.temporaryLectureSchedule.createMany({
      data: temporaryLectureSchedule,
    });
  }

  async trxDeleteTemporaryLectureSchedule(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<void> {
    await transaction.temporaryLectureSchedule.deleteMany({
      where: { lectureId },
    });
  }

  async trxCreateLectureImg(
    transaction: PrismaTransaction,
    lectureImg: LectureImageInputData[],
  ): Promise<void> {
    await transaction.lectureImage.createMany({
      data: lectureImg,
    });
  }

  async trxCreateLectureToRegions(
    transaction: PrismaTransaction,
    lectureToRegionInputData: LectureToRegionInputData[],
  ): Promise<void> {
    await transaction.lectureToRegion.createMany({
      data: lectureToRegionInputData,
    });
  }

  async getRegionsId(regions: Region[]): Promise<Id[]> {
    const regionsId: Id[] = await this.prismaService.region.findMany({
      where: { OR: regions },
      select: { id: true },
    });

    return regionsId;
  }

  async trxCreateLectureToDanceGenres(
    transaction: PrismaTransaction,
    lectureToDanceGenreInputData: LectureToDanceGenreInputData[],
  ): Promise<void> {
    await transaction.lectureToDanceGenre.createMany({
      data: lectureToDanceGenreInputData,
    });
  }

  async trxCreateLectureNotification(
    transaction: PrismaTransaction,
    lectureId: number,
    notification: string,
  ): Promise<void> {
    await transaction.lectureNotification.create({
      data: { lectureId, notification },
    });
  }
  async trxCreateLectureHoliday(
    transaction: PrismaTransaction,
    lectureHoliday: LectureHolidayInputData[],
  ): Promise<void> {
    await transaction.lectureHoliday.createMany({
      data: lectureHoliday,
    });
  }
}
