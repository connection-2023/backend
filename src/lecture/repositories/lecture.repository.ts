import { QueryFilter } from '@src/common/filters/query.filter';
import { PrismaService } from './../../prisma/prisma.service';
import { CreateLectureDto } from '../dtos/create-lecture.dto';
import { Lecture, LectureImage, LectureSchedule, Region } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaTransaction, Id } from '@src/common/interface/common-interface';

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
}
