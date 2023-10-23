import { PrismaService } from '@src/prisma/prisma.service';
import { Lecture, LectureSchedule, Region } from '@prisma/client';
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

@Injectable()
export class LectureRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async trxCreateLecture(
    transaction: PrismaTransaction,
    lecturerId: number,
    lectureMethodId: number,
    lectureTypeId: number,
    lecture: LectureInputData,
  ): Promise<Lecture> {
    return await transaction.lecture.create({
      data: {
        lecturerId,
        lectureMethodId,
        lectureTypeId,
        ...lecture,
      },
    });
  }

  async trxCreateLectureSchedule(
    transaction: PrismaTransaction,
    lectureSchedule: LectureScheduleInputData[],
  ): Promise<void> {
    await transaction.lectureSchedule.createMany({
      data: lectureSchedule,
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

  // async trxUpdateLecture(
  //   transaction: PrismaTransaction,
  //   lectureId: number,
  //   lecture: LectureInputData,
  // ): Promise<Lecture> {
  //   return await transaction.lecture.update({
  //     where: { id: lectureId },
  //     data: lecture,
  //   });
  // }

  // async trxUpdateLectureImg(
  //   transaction: PrismaTransaction,
  //   lectureId: number,
  //   lectureImg: LectureImageInputData[],
  // ): Promise<void> {
  //   await transaction.lectureImage.updateMany({
  //     where: { lectureId },
  //     data: lectureImg,
  //   });
  // }

  // async trxUpdateLectureToRegions(
  //   transaction: PrismaTransaction,
  //   lectureId: number,
  //   lectureToRegion: LectureToRegionInputData[],
  // ): Promise<void> {
  //   await transaction.lectureToRegion.updateMany({
  //     where: { lectureId },
  //     data: lectureToRegion,
  //   });
  // }

  // async trxUpdateLectureToDanceGenres(
  //   transaction: PrismaTransaction,
  //   lectureId: number,
  //   lectureToDanceGenre: LectureToDanceGenreInputData[],
  // ): Promise<void> {
  //   await transaction.lectureToDanceGenre.updateMany({
  //     where: { lectureId },
  //     data: lectureToDanceGenre,
  //   });
  // }

  // async trxUpdateLectureNotification(
  //   transaction: PrismaTransaction,
  //   lectureId: number,
  //   notification: string,
  // ): Promise<void> {
  //   await transaction.lectureNotification.update({
  //     where: { lectureId },
  //     data: { lectureId, notification },
  //   });
  // }
  // async trxUpdateLectureHoliday(
  //   transaction: PrismaTransaction,
  //   lectureHoliday: LectureHolidayInputData[],
  // ): Promise<void> {
  //   await transaction.lectureHoliday.createMany({
  //     data: lectureHoliday,
  //   });
  // }
}
