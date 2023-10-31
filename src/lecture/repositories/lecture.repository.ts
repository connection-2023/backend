import { PrismaService } from '@src/prisma/prisma.service';
import {
  Lecture,
  LectureSchedule,
  Region,
  LectureCoupon,
} from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaTransaction, Id } from '@src/common/interface/common-interface';
import {
  LectureCouponTargetInputData,
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

  async trxCreateLectureCouponTarget(
    transaction: PrismaTransaction,
    lectureCouponTargetInputData: LectureCouponTargetInputData[],
  ): Promise<void> {
    await transaction.lectureCouponTarget.createMany({
      data: lectureCouponTargetInputData,
    });
  }

  async readLecture(lectureId: number): Promise<Lecture> {
    return await this.prismaService.lecture.findFirst({
      where: { id: lectureId },
      include: {
        lecturer: {
          select: {
            nickname: true,
            lecturerProfileImageUrl: { select: { url: true } },
          },
        },
        lectureType: { select: { name: true } },
        lectureMethod: { select: { name: true } },
        lectureReview: {
          select: {
            id: true,
            userId: true,
            users: {
              select: {
                nickname: true,
                userProfileImage: { select: { imageUrl: true } },
              },
            },
            stars: true,
            description: true,
          },
        },
        lectureNotification: { select: { notification: true } },
        lectureImage: { select: { imageUrl: true } },
        lectureCouponTarget: {
          select: {
            lectureCoupon: {
              select: {
                id: true,
                lecturerId: true,
                title: true,
                percentage: true,
                discountPrice: true,
                maxDiscountPrice: true,
                maxUsageCount: true,
                usageCount: true,
                isStackable: true,
                startAt: true,
                endAt: true,
              },
            },
          },
          where: { lectureCoupon: { isDisabled: false } },
        },
        lectureSchedule: true,
        lectureHoliday: { select: { holiday: true } },
        lectureToRegion: {
          select: {
            region: {
              select: { administrativeDistrict: true, district: true },
            },
          },
        },
        lectureToDanceGenre: {
          select: { name: true, danceCategory: { select: { genre: true } } },
        },
      },
    });
  }

  async readManyLecture(
    where,
    order: { [orderBy: string]: string },
    skip: number,
    take: number,
  ): Promise<Lecture[]> {
    console.log(where);

    return await this.prismaService.lecture.findMany({
      where: { ...where },
      orderBy: order,
      skip,
      take,
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
