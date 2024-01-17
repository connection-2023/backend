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
  LectureNotification,
} from '@prisma/client';
import { Injectable } from '@nestjs/common';
import {
  PrismaTransaction,
  Id,
  ICursor,
} from '@src/common/interface/common-interface';
import {
  DaySchedule,
  DayScheduleInputData,
  EnrollLectureReservationResponseData,
  LectureCouponTargetInputData,
  LectureHolidayInputData,
  LectureImageInputData,
  LectureInputData,
  LectureLocation,
  LectureLocationInputData,
  LectureScheduleInputData,
  LectureScheduleParticipantResponseData,
  LectureScheduleResponseData,
  LectureToDanceGenreInputData,
  LectureToRegionInputData,
  RegularLectureSchedules,
  RegularLectureStatusInputData,
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

  async trxCreateRegularLectureStatus(
    transaction: PrismaTransaction,
    regularSchedules: RegularLectureStatusInputData[],
  ): Promise<void> {
    await transaction.regularLectureStatus.createMany({
      data: regularSchedules,
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
        lectureToRegion: {
          select: {
            region: {
              select: { administrativeDistrict: true, district: true },
            },
          },
        },
        lectureImage: true,
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
        lecturer: true,
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
      include: { lectureNotification: true },
    });
  }

  async trxReadManyLectureSchedule(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<LectureSchedule[]> {
    return await transaction.lectureSchedule.findMany({
      where: { lectureId },
      orderBy: { startDateTime: 'asc' },
    });
  }

  async trxReadManyLectureHoliday(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<LectureHoliday[]> {
    return await transaction.lectureHoliday.findMany({
      where: { lectureId },
      orderBy: { holiday: 'asc' },
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
    return await this.prismaService.lecture.findMany({
      where: { lecturerId },
      include: {
        lectureImage: { select: { imageUrl: true } },
        lectureToDanceGenre: {
          select: { danceCategory: { select: { genre: true } } },
        },
        lectureToRegion: { select: { region: true } },
        lectureMethod: { select: { name: true } },
      },
    });
  }

  async trxReadManyEnrollLectureWithUserId(
    transaction: PrismaTransaction,
    userId: number,
    take: number,
    currentTime,
    cursor?: ICursor,
    skip?: number,
  ): Promise<any> {
    return await transaction.payment.findMany({
      where: {
        userId,
        ...currentTime,
      },
      take,
      skip,
      cursor,
      orderBy: { createdAt: 'desc' },
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
            profileCardImageUrl: true,
          },
        },
      },
    });
  }

  async trxEnrollLectureCount(
    transaction: PrismaTransaction,
    userId: number,
  ): Promise<number> {
    return await transaction.payment.count({ where: { userId } });
  }

  async trxUpsertLectureNotification(
    transaction: PrismaTransaction,
    lectureId: number,
    notification: string,
  ): Promise<LectureNotification> {
    return await transaction.lectureNotification.upsert({
      where: { lectureId },
      create: { lectureId, notification },
      update: { notification },
    });
  }

  async trxReadManyLectureProgress(
    transaction: PrismaTransaction,
    lecturerId: number,
  ): Promise<LectureScheduleResponseData[]> {
    return await transaction.lecture.findMany({
      where: { lecturerId, isActive: true },
      include: { _count: { select: { lectureSchedule: true } } },
      orderBy: { id: 'desc' },
    });
  }

  async trxReadManyCompletedLectureScheduleCount(
    transaction: PrismaTransaction,
    lectureId: number,
    currentTime: Date,
  ): Promise<number> {
    return await transaction.lectureSchedule.count({
      where: { lectureId, startDateTime: { lt: currentTime } },
    });
  }

  async readManyCompletedLectureWithLecturerId(
    lecturerId: number,
  ): Promise<Lecture[]> {
    return await this.prismaService.lecture.findMany({
      where: { lecturerId, deletedAt: null, isActive: false },
      include: { _count: { select: { lectureSchedule: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async readScheduleReservation(
    lectureId: number,
    holiday: Date,
  ): Promise<Reservation[]> {
    return await this.prismaService.reservation.findMany({
      where: {
        lectureSchedule: {
          lectureId,
          startDateTime: {
            gte: new Date(holiday),
            lt: new Date(new Date(holiday).getTime() + 24 * 60 * 60 * 1000),
          },
        },
      },
    });
  }

  async trxReadLectureParticipant(
    transaction: PrismaTransaction,
    lectureId: number,
    maxCapacity: number,
    currentTime: Date,
  ): Promise<LectureSchedule> {
    return await transaction.lectureSchedule.findFirst({
      where: {
        lectureId,
        numberOfParticipants: { gte: maxCapacity },
        startDateTime: { gte: currentTime },
      },
    });
  }

  async readManyParticipantWithLectureId(lectureId: number): Promise<any> {
    return await this.prismaService.lecture.findFirst({
      where: { id: lectureId },
      include: {
        lectureSchedule: {
          select: {
            reservation: {
              select: {
                user: {
                  include: { userProfileImage: { select: { imageUrl: true } } },
                },
              },
            },
          },
        },
      },
    });
  }

  async readManyParticipantWithScheduleId(
    scheduleId: number,
  ): Promise<LectureScheduleParticipantResponseData> {
    return await this.prismaService.lectureSchedule.findFirst({
      where: { id: scheduleId },
      select: {
        reservation: {
          select: {
            user: {
              select: {
                id: true,
                nickname: true,
                userProfileImage: { select: { imageUrl: true } },
              },
            },
          },
        },
      },
    });
  }

  async getLectureLearnerList(
    lecturerId: number,
    lectureId: number,
    take: number,
    cursor?: object,
  ) {
    return await this.prismaService.lecturerLearner.findMany({
      where: {
        lecturerId,
        user: { reservation: { some: { lectureSchedule: { lectureId } } } },
      },
      take,
      cursor,
      include: { user: true },
    });
  }

  async readManyLectureSchedulesWithLecturerId(
    where,
  ): Promise<LectureSchedule[]> {
    return await this.prismaService.lectureSchedule.findMany({
      where,
      include: {
        lecture: {
          select: {
            id: true,
            title: true,
            isGroup: true,
            maxCapacity: true,
          },
        },
      },
      orderBy: [{ startDateTime: 'asc' }, { id: 'desc' }],
    });
  }

  async trxCreateLectureDay(
    transaction: PrismaTransaction,
    daySchedules: DayScheduleInputData[],
  ): Promise<void> {
    await transaction.lectureDay.createMany({ data: daySchedules });
  }

  async trxReadDaySchedule(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<DaySchedule[]> {
    return await transaction.lectureDay.findMany({
      where: { lectureId },
    });
  }

  async readManyDailySchedulesWithLecturerId(
    where,
  ): Promise<LectureSchedule[]> {
    return await this.prismaService.lectureSchedule.findMany({
      where,
      orderBy: { startDateTime: 'asc' },
      include: {
        lecture: { select: { id: true, title: true } },
      },
    });
  }

  async readManyLatestLecturesWithUserId(userId: number): Promise<Lecture[]> {
    return await this.prismaService.lecture.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        lecturer: { blockedLecturer: { none: { userId } } },
      },
      take: 8,
      include: {
        likedLecture: { where: { userId } },
        lectureImage: { orderBy: { id: 'asc' } },
        lecturer: true,
        lectureToDanceGenre: { include: { danceCategory: true } },
        lectureToRegion: { include: { region: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async readManyLatestLecturesByNonMember(): Promise<Lecture[]> {
    return await this.prismaService.lecture.findMany({
      where: { deletedAt: null, isActive: true },
      take: 8,
      include: {
        lectureImage: { orderBy: { id: 'asc' } },
        lecturer: true,
        lectureToDanceGenre: { include: { danceCategory: true } },
        lectureToRegion: { include: { region: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
