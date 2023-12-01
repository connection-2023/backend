import { PrismaService } from '@src/prisma/prisma.service';
import {
  Lecture,
  LectureSchedule,
  Region,
  LectureCoupon,
  LectureCouponTarget,
  LectureReview,
  LectureHoliday,
  Reservation,
  LikedLecture,
} from '@prisma/client';
import { Injectable } from '@nestjs/common';
import {
  PrismaTransaction,
  Id,
  ICursor,
} from '@src/common/interface/common-interface';
import {
  EnrollLectureReservationResponseData,
  LectureCouponTargetInputData,
  LectureHolidayInputData,
  LectureImageInputData,
  LectureInputData,
  LectureLocation,
  LectureLocationInputData,
  LectureScheduleInputData,
  LectureToDanceGenreInputData,
  LectureToRegionInputData,
} from '@src/lecture/interface/lecture.interface';
import { UpdateLectureDto } from '../dtos/update-lecture.dto';

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

  async trxCreateLectureLocation(
    transaction: PrismaTransaction,
    lectureLocationInputData: LectureLocationInputData,
  ): Promise<void> {
    await transaction.lectureLocation.create({
      data: lectureLocationInputData,
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

  async trxCreateLectureImage(
    transaction: PrismaTransaction,
    lectureImage: LectureImageInputData[],
  ): Promise<void> {
    await transaction.lectureImage.createMany({
      data: lectureImage,
    });
  }

  async trxDeleteLectureImage(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<void> {
    await transaction.lectureImage.deleteMany({ where: { lectureId } });
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
        lectureType: { select: { name: true } },
        lectureMethod: { select: { name: true } },
        lectureNotification: true,
        lectureImage: { select: { imageUrl: true } },
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
    return await this.prismaService.lecture.findMany({
      where: { ...where, deletedAt: null },
      orderBy: order,
      skip,
      take,
      include: {
        lecturer: { include: { lecturerProfileImageUrl: true } },
        lectureToRegion: { include: { region: true } },
        lectureToDanceGenre: { include: { danceCategory: true } },
      },
    });
  }
  async trxUpdateLecture(
    transaction: PrismaTransaction,
    lectureId: number,
    lecture: UpdateLectureDto,
  ): Promise<Lecture> {
    return await transaction.lecture.update({
      where: { id: lectureId },
      data: lecture,
    });
  }

  async trxReadManyLectureSchedule(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<LectureSchedule[]> {
    return await transaction.lectureSchedule.findMany({
      where: { lectureId },
    });
  }

  async trxReadManyLectureHoliday(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<LectureHoliday[]> {
    return await transaction.lectureHoliday.findMany({
      where: { lectureId },
    });
  }

  async trxDeleteLectureCouponTarget(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<void> {
    await transaction.lectureCouponTarget.deleteMany({ where: { lectureId } });
  }

  async readLectureLocation(lectureId: number): Promise<LectureLocation> {
    return await this.prismaService.lectureLocation.findUnique({
      where: { lectureId },
    });
  }

  async trxDeleteManyOldSchedule(
    transaction: PrismaTransaction,
    lectureId: number,
    OldSchedule: Date[],
  ): Promise<void> {
    await transaction.lectureSchedule.deleteMany({
      where: {
        lectureId: lectureId,
        startDateTime: {
          in: OldSchedule.map((date) => new Date(date)),
        },
      },
    });
  }

  async trxDeleteManyLectureHoliday(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<void> {
    await transaction.lectureHoliday.deleteMany({ where: { lectureId } });
  }

  async trxCreateManyLectureHoliday(
    transaction: PrismaTransaction,
    lectureHoliday: LectureHolidayInputData,
  ) {
    await transaction.lectureHoliday.createMany({ data: lectureHoliday });
  }

  async getCouponId(coupons: number[]): Promise<Id[]> {
    return await this.prismaService.lectureCoupon.findMany({
      where: { id: { in: coupons } },
    });
  }

  async readLectureReservationWithUser(
    userId: number,
    lectureId: number,
  ): Promise<Reservation> {
    return await this.prismaService.reservation.findFirst({
      where: { userId, lectureSchedule: { lectureId } },
    });
  }

  async readManyLectureWithLectruerId(lecturerId: number): Promise<Lecture[]> {
    return await this.prismaService.lecture.findMany({ where: { lecturerId } });
  }

  async readManyEnrollLectureWithUserId(
    userId: number,
    take: number,
    currentTime,
    cursor?: ICursor,
    skip?: number,
  ): Promise<any> {
    return await this.prismaService.payment.findMany({
      where: {
        userId,
        ...currentTime,
      },
      take,
      skip,
      cursor,
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        orderId: true,
        orderName: true,
        reservation: {
          select: {
            lectureSchedule: {
              select: {
                startDateTime: true,
                lecture: {
                  select: {
                    id: true,
                    title: true,
                    lectureImage: { select: { imageUrl: true }, take: 1 },
                  },
                },
              },
            },
          },
        },
        lecturer: {
          select: {
            nickname: true,
            lecturerProfileImageUrl: { select: { url: true }, take: 1 },
          },
        },
      },
    });
  }
}
