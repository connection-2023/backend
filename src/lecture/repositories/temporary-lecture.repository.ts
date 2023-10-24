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
import {
  TemporaryLectureImageInputData,
  TemporaryLectureScheduleInputData,
  TemporaryLectureToRegionInputData,
} from '../interface/temporary-lecture.interface';

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

  async trxCreateLectureImage(
    transaction: PrismaTransaction,
    temporaryLectureImage: TemporaryLectureImageInputData[],
  ): Promise<void> {
    await transaction.temporaryLectureImage.createMany({
      data: temporaryLectureImage,
    });
  }

  async trxDeleteTemporaryImage(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<void> {
    await transaction.temporaryLectureImage.deleteMany({
      where: { lectureId },
    });
  }

  async trxCreateLectureToRegions(
    transaction: PrismaTransaction,
    temporaryLectureToRegionInputData: TemporaryLectureToRegionInputData[],
  ): Promise<void> {
    await transaction.temporaryLectureToRegion.createMany({
      data: temporaryLectureToRegionInputData,
    });
  }

  async trxDeleteLectureToREgions(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<void> {
    await transaction.temporaryLectureToRegion.deleteMany({
      where: { lectureId },
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
