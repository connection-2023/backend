import { PrismaService } from '@src/prisma/prisma.service';
import {
  Lecture,
  Region,
  TemporaryLecture,
  TemporaryLectureDay,
} from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaTransaction, Id } from '@src/common/interface/common-interface';
import {
  TemporaryLectureCouponTargetInputData,
  TemporaryLectureDayInputData,
  TemporaryLectureDayScheduleInpuData,
  TemporaryLectureHolidayInputData,
  TemporaryLectureImageInputData,
  TemporaryLectureInputData,
  TemporaryLectureLocation,
  TemporaryLectureLocationInputData,
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
  ): Promise<TemporaryLecture> {
    return await transaction.temporaryLecture.update({
      where: { id: lectureId },
      data: { ...lecture, updatedAt: new Date() },
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

  async trxCreateTemporaryLectureCouponTarget(
    transaction: PrismaTransaction,
    temporaryLectureCouponTargetInputData: TemporaryLectureCouponTargetInputData[],
  ): Promise<void> {
    await transaction.temporaryLectureCouponTarget.createMany({
      data: temporaryLectureCouponTargetInputData,
    });
  }

  async trxDeleteTemporaryLectureCouponTarget(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<void> {
    await transaction.temporaryLectureCouponTarget.deleteMany({
      where: { lectureId },
    });
  }

  async readOneTemporaryLecture(lectureId: number): Promise<TemporaryLecture> {
    return await this.prismaService.temporaryLecture.findFirst({
      where: { id: lectureId },
      include: {
        lectureType: { select: { name: true } },
        lectureMethod: { select: { name: true } },
        temporaryLecturenotification: { select: { notification: true } },
        temporaryLectureImage: { select: { imageUrl: true } },
        temporaryLectureCouponTarget: { select: { lectureCouponId: true } },
        temporaryLectureToRegion: {
          select: {
            region: {
              select: { administrativeDistrict: true, district: true },
            },
          },
        },
        temporaryLectureToDanceGenre: {
          select: { name: true, danceCategory: { select: { genre: true } } },
        },
        temporaryLectureHoliday: { select: { holiday: true } },
      },
    });
  }

  async trxDeleteTemporaryLectureDay(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<void> {
    await transaction.temporaryLectureDay.deleteMany({ where: { lectureId } });
  }

  async trxCreateTemporaryLectureDay(
    transaction: PrismaTransaction,
    temporaryLectureDayInputData: TemporaryLectureDayInputData,
  ): Promise<TemporaryLectureDay> {
    return await transaction.temporaryLectureDay.create({
      data: temporaryLectureDayInputData,
    });
  }

  async trxDeleteTemporaryLectureDaySchedule(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<void> {
    await transaction.temporaryLectureDaySchedule.deleteMany({
      where: { temporaryLectureDay: { lectureId } },
    });
  }

  async trxCreateTemporaryLectureDaySchedule(
    transaction: PrismaTransaction,
    temporaryLectureDayScheduleInputData: TemporaryLectureDayScheduleInpuData[],
  ): Promise<void> {
    await transaction.temporaryLectureDaySchedule.createMany({
      data: temporaryLectureDayScheduleInputData,
    });
  }

  async trxUpsertTemporaryLectureLocation(
    transaction: PrismaTransaction,
    lectureId: number,
    address: string,
    detailAddress: string,
    buildingName: string,
  ): Promise<void> {
    await transaction.temporaryLectureLocation.upsert({
      where: { lectureId },
      update: { address, detailAddress, buildingName },
      create: { lectureId, address, detailAddress, buildingName },
    });
  }

  async trxGetTemporaryLectureRegionId(
    transaction: PrismaTransaction,
    administrativeDistrict: string,
    district: string,
  ): Promise<Id> {
    return await transaction.region.findFirst({
      where: { administrativeDistrict, district },
      select: { id: true },
    });
  }
}
