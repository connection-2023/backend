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
  RegularLectureSchedule,
  RegularLectureStatus,
  LecturerLearner,
  LectureLocation,
} from '@prisma/client';
import { ConflictException, Injectable } from '@nestjs/common';
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
  LectureLocationInputData,
  LectureScheduleInputData,
  LectureScheduleParticipantResponseData,
  LectureScheduleResponseData,
  LectureToDanceGenreInputData,
  LectureToRegionInputData,
  RegularLectureSchedules,
  RegularLectureSchedulesInputData,
  RegularLectureStatusInputData,
} from '@src/lecture/interface/lecture.interface';
import { UpdateLectureDto } from '../dtos/update-lecture.dto';
import { LectureScheduleDto } from '@src/common/dtos/lecture-schedule.dto';
import { RegularLectureScheduleDto } from '@src/common/dtos/regular-lecture-schedule.dto';

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
    try {
      await transaction.lectureSchedule.createMany({
        data: lectureSchedule,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Lecture schedule with the same lectureId and startDateTime already exists.',
        );
      } else {
        throw error;
      }
    }
  }

  async trxCreateRegularLectureStatus(
    transaction: PrismaTransaction,
    regularSchedules: RegularLectureStatusInputData,
  ): Promise<RegularLectureStatus> {
    return await transaction.regularLectureStatus.create({
      data: regularSchedules,
    });
  }

  async trxCreateRegularLectureSchedule(
    transaction: PrismaTransaction,
    regularSchedules: RegularLectureSchedulesInputData[],
  ): Promise<void> {
    await transaction.regularLectureSchedule.createMany({
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

  async trxCreateLectureToLocationRegion(
    transaction: PrismaTransaction,
    lectureToRegionInputData: LectureToRegionInputData,
  ): Promise<void> {
    await transaction.lectureToRegion.create({
      data: lectureToRegionInputData,
    });
  }

  async getRegionsId(regions): Promise<Id[]> {
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

  async readLecture(lectureId: number, userId?: number): Promise<Lecture> {
    const include = {
      lectureType: true,
      lectureMethod: true,
      lectureNotification: true,
      lectureToRegion: {
        include: {
          region: true,
        },
      },
      lectureImage: true,
      lectureToDanceGenre: {
        include: { danceCategory: true },
      },
      lecturer: true,
      lectureLocation: true,
    };

    userId ? (include['likedLecture'] = { where: { userId } }) : false;

    return await this.prismaService.lecture.findFirst({
      where: { id: lectureId },
      include,
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

  async trxReadManyRegularLectureSchedules(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<RegularLectureSchedule[]> {
    return await transaction.regularLectureSchedule.findMany({
      where: { regularLectureStatus: { lectureId } },
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

  async getEnrollSchedule(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<LectureScheduleDto[]> {
    return await this.prismaService.lectureSchedule.findMany({
      where: {
        reservation: { some: { userId } },
        startDateTime: { gte: startDate, lte: endDate },
      },
      include: { lecture: true },
      orderBy: { startDateTime: 'asc' },
    });
  }

  async getEnrollRegularSchedule(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<RegularLectureSchedule[]> {
    return await this.prismaService.regularLectureSchedule.findMany({
      where: {
        regularLectureStatus: { reservation: { some: { userId } } },
        startDateTime: { gte: startDate, lte: endDate },
      },
      include: { regularLectureStatus: { select: { lecture: true } } },
      orderBy: { startDateTime: 'asc' },
    });
  }

  async getDetailEnrollSchedule(
    scheduleId: number,
    userId: number,
  ): Promise<Reservation> {
    return await this.prismaService.reservation.findFirst({
      where: { lectureScheduleId: scheduleId, userId },
      include: {
        lectureSchedule: {
          include: {
            lecture: {
              include: {
                lecturer: true,
                lectureNotification: true,
                lectureLocation: true,
              },
            },
          },
        },
        payment: true,
      },
    });
  }

  async getDetailEnrollRegularSchedule(
    scheduleId: number,
    userId: number,
  ): Promise<Reservation> {
    return await this.prismaService.reservation.findFirst({
      where: {
        regularLectureStatus: {
          regularLectureSchedule: { some: { id: scheduleId } },
        },
        userId,
      },
      include: {
        payment: true,
        regularLectureStatus: {
          select: {
            regularLectureSchedule: { orderBy: { startDateTime: 'asc' } },
            lecture: {
              include: {
                lectureLocation: true,
                lectureNotification: true,
                lecturer: true,
              },
            },
          },
        },
      },
    });
  }

  async trxEnrollLectureCount(
    transaction: PrismaTransaction,
    where,
  ): Promise<number> {
    return await transaction.reservation.count({ where });
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

  async getLectureLearnerList(
    lecturerId: number,
    lectureId: number,
    take: number,
    cursor?: object,
  ) {
    return await this.prismaService.lecturerLearner.findMany({
      where: {
        lecturerId,
        OR: [
          {
            user: { reservation: { some: { lectureSchedule: { lectureId } } } },
          },
          {
            user: {
              reservation: { some: { regularLectureStatus: { lectureId } } },
            },
          },
        ],
      },
      take,
      cursor,
      include: { user: { include: { userProfileImage: true } } },
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

  async trxReadRegularLectureStatus(
    transaction: PrismaTransaction,
    lectureId: number,
  ): Promise<RegularLectureStatus[]> {
    return await transaction.regularLectureStatus.findMany({
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

  async getLectureScheduleLearnerList(lecturerId: number, scheduleId: number) {
    return await this.prismaService.reservation.findMany({
      where: { lectureScheduleId: scheduleId, payment: { lecturerId } },
    });
  }

  async getLecturerLearnerInfo(userId: number) {
    return await this.prismaService.lecturerLearner.findFirst({
      where: {
        userId,
      },
      include: { user: { include: { userProfileImage: true } } },
    });
  }

  async trxExistLectureSchedule(
    transaction: PrismaTransaction,
    lectureSchduleInputData: LectureScheduleInputData[],
  ): Promise<LectureSchedule[]> {
    return await transaction.lectureSchedule.findMany({
      where: { OR: lectureSchduleInputData },
    });
  }
}
