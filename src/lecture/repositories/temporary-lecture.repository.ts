import { PrismaService } from '@src/prisma/prisma.service';
import { Lecture, Region } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaTransaction, Id } from '@src/common/interface/common-interface';
import {
  TemporaryLectureHolidayInputData,
  TemporaryLectureImageInputData,
  TemporaryLectureInputData,
  TemporaryLectureScheduleInputData,
  TemporaryLectureToDanceGenreInputData,
  TemporaryLectureToRegionInputData,
} from '../interface/temporary-lecture.interface';

@Injectable()
export class LectureTemporarilySaveRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async trxUpdateTemporaryLecture(
    transaction: PrismaTransaction,
    lectureId: number,
    lecture: TemporaryLectureInputData,
  ): Promise<Lecture> {
    return await transaction.temporaryLecture.update({
      where: { id: lectureId },
      data: { ...lecture },
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

  async trxCreateTemporaryLectureImage(
    transaction: PrismaTransaction,
    temporaryLectureImage: TemporaryLectureImageInputData[],
  ): Promise<void> {
    await transaction.temporaryLectureImage.createMany({
      data: temporaryLectureImage,
    });
  }

  async trxDeleteTemporaryLectureImage(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<void> {
    await transaction.temporaryLectureImage.deleteMany({
      where: { lectureId },
    });
  }

  async trxCreateTemporaryLectureToRegions(
    transaction: PrismaTransaction,
    temporaryLectureToRegionInputData: TemporaryLectureToRegionInputData[],
  ): Promise<void> {
    await transaction.temporaryLectureToRegion.createMany({
      data: temporaryLectureToRegionInputData,
    });
  }

  async trxDeleteTemporaryLectureToRegions(
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

  async trxCreateTemporaryLectureToDanceGenres(
    transaction: PrismaTransaction,
    temporaryLectureToDanceGenreInputData: TemporaryLectureToDanceGenreInputData[],
  ): Promise<void> {
    await transaction.temporaryLectureToDanceGenre.createMany({
      data: temporaryLectureToDanceGenreInputData,
    });
  }

  async trxDeleteTemporaryLectureToDanceGenres(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<void> {
    await transaction.temporaryLectureToDanceGenre.deleteMany({
      where: { lectureId },
    });
  }

  async trxUpsertTemporaryLectureNotification(
    transaction: PrismaTransaction,
    lectureId: number,
    notification: string,
  ): Promise<void> {
    await transaction.temporaryLectureNotification.upsert({
      where: { lectureId },
      update: { lectureId, notification },
      create: { lectureId, notification },
    });
  }

  async trxCreateTemporaryLectureHoliday(
    transaction: PrismaTransaction,
    temporaryLectureHoliday: TemporaryLectureHolidayInputData[],
  ): Promise<void> {
    await transaction.temporaryLectureHoliday.createMany({
      data: temporaryLectureHoliday,
    });
  }

  async trxDeleteTemporaryLectureHoliday(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<void> {
    await transaction.temporaryLectureHoliday.deleteMany({
      where: { lectureId },
    });
  }
}
