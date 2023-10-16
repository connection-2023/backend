import { QueryFilter } from '@src/common/filters/query.filter';
import { PrismaService } from './../../prisma/prisma.service';
import { CreateLectureDto } from '../dtos/create-lecture.dto';
import {
  Lecture,
  LectureImage,
  LectureNotification,
  LectureSchedule,
  LectureToRegion,
  Region,
} from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaTransaction, Id } from '@src/common/interface/common-interface';
import {
  LectureImageInputData,
  LectureInputData,
  LectureNotificationResponse,
  LectureToDanceGenreInputData,
  LectureToRegionInputData,
} from '../interface/lecture.interface';

@Injectable()
export class LectureRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async trxCreateLecture(
    transaction: PrismaTransaction,
    lecturerId: number,
    lecture: LectureInputData,
  ): Promise<Lecture> {
    return await transaction.lecture.create({
      data: {
        lecturerId,
        ...lecture,
      },
    });
  }

  async trxCreateLectureSchedule(
    transaction: PrismaTransaction,
    lectureSchedule,
  ): Promise<LectureSchedule[]> {
    await transaction.lectureSchedule.createMany({
      data: lectureSchedule,
    });

    return await transaction.lectureSchedule.findMany({
      where: { lectureId: lectureSchedule.lectureId },
    });
  }

  async trxCreateLectureImg(
    transaction: PrismaTransaction,
    lectureImg: LectureImageInputData[],
    lectureId: number,
  ): Promise<LectureImage[]> {
    await transaction.lectureImage.createMany({
      data: lectureImg,
    });

    return await transaction.lectureImage.findMany({
      where: { lectureId: lectureId },
    });
  }

  async trxCreateLectureToRegions(
    transaction: PrismaTransaction,
    lectureToRegionInputData: LectureToRegionInputData[],
  ): Promise<LectureToRegion[]> {
    await transaction.lectureToRegion.createMany({
      data: lectureToRegionInputData,
    });

    return transaction.lectureToRegion.findMany({
      where: { lectureId: lectureToRegionInputData[0].lectureId },
      include: {
        region: { select: { administrativeDistrict: true, district: true } },
      },
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
  ): Promise<LectureNotificationResponse> {
    await transaction.lectureNotification.create({
      data: { lectureId, notification },
    });

    return transaction.lectureNotification.findFirst({
      where: { lectureId },
      select: { notification: true },
    });
  }
}
