import { LectureRepository } from '@src/lecture/repositories/lecture.repository';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLectureDto } from '@src/lecture/dtos/create-lecture.dto';
import { Lecture, LectureHoliday, Region, Reservation } from '@prisma/client';
import { ReadManyLectureQueryDto } from '@src/lecture/dtos/read-many-lecture-query.dto';
import { UpdateLectureDto } from '@src/lecture/dtos/update-lecture.dto';
import { QueryFilter } from '@src/common/filters/query.filter';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  PrismaTransaction,
  Id,
  ValidateResult,
} from '@src/common/interface/common-interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  LectureCouponTargetInputData,
  LectureHolidayInputData,
  LectureImageInputData,
  LectureScheduleInputData,
  LectureToDanceGenreInputData,
  LectureToRegionInputData,
  RegularLectureSchedules,
} from '@src/lecture/interface/lecture.interface';
import { Cache } from 'cache-manager';
import { DanceCategory } from '@src/common/enum/enum';
import { ReadManyEnrollLectureQueryDto } from '../dtos/read-many-enroll-lecture-query.dto';
import { LectureLearnerDto } from '../dtos/lecture-learner.dto';
import { GetLectureLearnerListDto } from '../dtos/get-lecture-learner-list.dto';
import { ReadManyLectureScheduleQueryDto } from '../dtos/read-many-lecture-schedule-query.dto';
import { LecturePreviewDto } from '../dtos/read-lecture-preview.dto';
import { LectureDetailDto } from '../dtos/read-lecture-detail.dto';
import { LectureLearnerInfoDto } from '../dtos/lecture-learner-info.dto';
import { EnrollLectureScheduleDto } from '../dtos/get-enroll-schedule.dto';
import { EnrollScheduleDetailQueryDto } from '../dtos/get-enroll-schedule-detail-query.dto';
import { DetailEnrollScheduleDto } from '../dtos/get-detail-enroll-schedule.dto';
import { GetEnrollLectureListQueryDto } from '../dtos/get-enroll-lecture-list-query.dto';
import { CombinedEnrollLectureWithCountDto } from '../dtos/combined-enroll-lecture-with-count.dto';
import { EventBus } from '@nestjs/cqrs';
import { NewLectureEvent } from '@src/notification/events/notification.event';
import { CombinedScheduleDto } from '../dtos/combined-schedule.dto';
import { EnrolledLectureScheduleDto } from '../dtos/last-regist-schedule.dto';

@Injectable()
export class LectureService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly lectureRepository: LectureRepository,
    private readonly queryFilter: QueryFilter,
    private readonly prismaService: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  async createLecture(createLectureDto: CreateLectureDto, lecturerId: number) {
    const {
      regions,
      location,
      schedules,
      regularSchedules,
      genres,
      etcGenres,
      notification,
      holidays,
      images,
      lectureMethod,
      lectureType,
      coupons,
      daySchedules,
      ...lecture
    } = createLectureDto;

    return await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const lectureMethodId = await this.getLectureMethodId(lectureMethod);
        const lectureTypeId = await this.getLectureTypeId(lectureType);

        const newLecture = await this.lectureRepository.trxCreateLecture(
          transaction,
          lecturerId,
          lectureMethodId,
          lectureTypeId,
          lecture,
        );

        if (location) {
          const { administrativeDistrict, district, ...address } = location;

          const locationArr = [{ administrativeDistrict, district }];

          const regionId = await this.lectureRepository.getRegionsId(
            locationArr,
          );

          const lectureLocationInputData = {
            lectureId: newLecture.id,
            ...address,
          };

          const lectureToRegionInputData = {
            lectureId: newLecture.id,
            regionId: regionId[0].id,
          };

          await this.lectureRepository.trxCreateLectureToLocationRegion(
            transaction,
            lectureToRegionInputData,
          );

          await this.lectureRepository.trxCreateLectureLocation(
            transaction,
            lectureLocationInputData,
          );
        }

        if (regions) {
          const regionIds: Id[] = await this.getValidRegionIds(regions);
          const lectureToRegionInputData: LectureToRegionInputData[] =
            this.createLectureToRegionInputData(newLecture.id, regionIds);
          await this.lectureRepository.trxCreateLectureToRegions(
            transaction,
            lectureToRegionInputData,
          );
        }

        const lectureImageInputData: LectureImageInputData[] =
          this.createLectureImageInputData(newLecture.id, images);
        await this.lectureRepository.trxCreateLectureImage(
          transaction,
          lectureImageInputData,
        );

        if (lectureMethod === '원데이') {
          const lectureScheduleInputData: LectureScheduleInputData[] =
            this.createLectureScheduleInputData(
              newLecture.id,
              schedules,
              lecture.duration,
            );
          await this.lectureRepository.trxCreateLectureSchedule(
            transaction,
            lectureScheduleInputData,
          );
        } else if (lectureMethod === '정기') {
          for (const schedule of regularSchedules) {
            const regularLectureStatusInputData =
              this.createRegularLectureStatusInputData(newLecture.id, schedule);

            const regularLectureStatus =
              await this.lectureRepository.trxCreateRegularLectureStatus(
                transaction,
                regularLectureStatusInputData,
              );

            const regularLectureSchedulesInputData =
              this.createRegularLectureSchedulesInputData(
                regularLectureStatus.id,
                schedule.startDateTime,
                lecture.duration,
              );

            const regularLectureSchedules =
              await this.lectureRepository.trxCreateRegularLectureSchedule(
                transaction,
                regularLectureSchedulesInputData,
              );
          }
        }

        if (daySchedules) {
          const daySchedulesInputData = daySchedules.map((daySchedule) => ({
            lectureId: newLecture.id,
            ...daySchedule,
          }));
          await this.lectureRepository.trxCreateLectureDay(
            transaction,
            daySchedulesInputData,
          );
        }

        if (holidays) {
          const lectureHolidayInputData: LectureHolidayInputData[] =
            this.createLectureHolidayInputData(newLecture.id, holidays);
          await this.lectureRepository.trxCreateLectureHoliday(
            transaction,
            lectureHolidayInputData,
          );
        }

        const lectureToDanceGenreInputData: LectureToDanceGenreInputData[] =
          await this.createLecturerDanceGenreInputData(
            newLecture.id,
            genres,
            etcGenres,
          );

        await this.lectureRepository.trxCreateLectureToDanceGenres(
          transaction,
          lectureToDanceGenreInputData,
        );

        if (notification) {
          await this.lectureRepository.trxCreateLectureNotification(
            transaction,
            newLecture.id,
            notification,
          );
        }

        if (coupons) {
          await this.getValidCouponIds(coupons);

          const lectureCouponTargetInputData: LectureCouponTargetInputData[] =
            this.createLectureCouponTargetInputData(newLecture.id, coupons);

          await this.lectureRepository.trxCreateLectureCouponTarget(
            transaction,
            lectureCouponTargetInputData,
          );
        }

        await this.eventBus.publish(
          new NewLectureEvent(newLecture.id, lecturerId),
        );

        return {
          newLecture,
        };
      },
    );
  }

  async readLecturePreview(lectureId: number, userId?: number) {
    const lecture = userId
      ? await this.lectureRepository.readLecture(lectureId, userId)
      : await this.lectureRepository.readLecture(lectureId);

    return new LecturePreviewDto(lecture);
  }

  async readLectureDetail(lectureId: number) {
    const lecture = await this.lectureRepository.readLecture(lectureId);

    return new LectureDetailDto(lecture);
  }

  async readManyLecture(query: ReadManyLectureQueryDto): Promise<any> {
    const {
      page,
      pageSize,
      lectureMethod,
      individualGroup,
      stars,
      regions,
      genres,
      orderBy,
      priceRange,
      schedules,
      ...filter
    } = query;

    const where = this.queryFilter.buildWherePropForFind(filter);
    const skip = page * pageSize;
    const take = pageSize;
    const order = {};

    if (regions) {
      const regionIds: Id[] = await this.getValidRegionIds(regions);
      const lectureToRegionFindData =
        this.createLectureToRegionFindData(regionIds);

      where['lectureToRegion'] = {
        some: {
          id: {
            in: lectureToRegionFindData,
          },
        },
      };
    }

    if (genres) {
      const lectureToGenreFindData = await this.getDanceCategoryIds(genres);

      where['lectureToDanceGenre'] = {
        some: {
          id: {
            in: lectureToGenreFindData,
          },
        },
      };
    }

    if (priceRange) {
      const price = this.createPriceFindData(priceRange);

      where['price'] = price;
    }

    if (schedules) {
      const scheduleFindData = this.createSchedulesFindData(schedules);

      where['lectureSchedule'] = {
        some: {
          startDateTime: {
            in: scheduleFindData,
          },
        },
      };
    }

    if (stars) {
      where['stars'] = {
        gte: stars / 1,
      };
    }

    if (lectureMethod) {
      const lectureMethodId = this.getLectureMethodId(lectureMethod);
      where['lectureMethodId'] = lectureMethodId;
    }

    if (individualGroup) {
      if (individualGroup === '개인') {
        where['minCapacity'] = 1;
        where['maxCapacity'] = 1;
      } else if (individualGroup === '그룹') {
        where['minCapacity'] = {
          gte: 1,
        };
        where['NOT'] = {
          maxCapacity: 1,
        };
      }
    }

    if (orderBy) {
      if (orderBy === '최신순') {
        order['createdAt'] = 'desc';
      } else if (orderBy === '별점순') {
        order['stars'] = 'desc';
      } else if (orderBy === '가격낮은순') {
        order['price'] = 'asc';
      }
    }

    return await this.lectureRepository.readManyLecture(
      where,
      order,
      skip,
      take,
    );
  }

  async deleteLecture(lectureId: number): Promise<Lecture> {
    const deletedLecture = await this.prismaService.lecture.update({
      where: { id: lectureId },
      data: { deletedAt: new Date() },
    });

    return deletedLecture;
  }

  async updateLecture(lectureId: number, updateLectureDto: UpdateLectureDto) {
    const {
      images,
      coupons,
      holidays,
      notification,
      endDate,
      schedules,
      ...lecture
    } = updateLectureDto;
    const currentTime = new Date();

    return await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        if (notification || notification.length === 0) {
          await this.lectureRepository.trxUpsertLectureNotification(
            transaction,
            lectureId,
            notification,
          );
        }
        if (lecture.maxCapacity) {
          const readLectureParticipant =
            await this.lectureRepository.trxReadLectureParticipant(
              transaction,
              lectureId,
              lecture.maxCapacity,
              currentTime,
            );
          if (readLectureParticipant) {
            throw new BadRequestException(
              `maxCapacityIsSmallerThanParticipants ${readLectureParticipant.numberOfParticipants}`,
            );
          }
        }
        if (endDate) {
          const isUpdatePossible = transaction.lecture.findFirst({
            where: { id: lectureId, endDate: { lt: new Date(endDate) } },
          });

          if (isUpdatePossible) {
            lecture['endDate'] = endDate;
          } else {
            throw new BadRequestException(
              '현재 마감일이 수정 마감일보다 큽니다.',
            );
          }
          const { duration } = await this.prismaService.lecture.findFirst({
            where: { id: lectureId },
            select: { duration: true },
          });

          const createNewScheduleInputData =
            this.createLectureScheduleInputData(lectureId, schedules, duration);

          const existLectureSchdule =
            await this.lectureRepository.trxExistLectureSchedule(
              transaction,
              createNewScheduleInputData,
            );

          if (existLectureSchdule) {
            throw new ConflictException(schedules, 'duplicated schedules');
          }

          await this.lectureRepository.trxCreateLectureSchedule(
            transaction,
            createNewScheduleInputData,
          );
        }

        const updatedLecture = await this.lectureRepository.trxUpdateLecture(
          transaction,
          lectureId,
          lecture,
        );

        if (holidays) {
          const oldHolidays =
            await this.lectureRepository.trxReadManyLectureHoliday(
              transaction,
              lectureId,
            );
          const oldHolidaysArr = this.createLectureHolidayArr(oldHolidays);
          const schedule = this.compareHolidays(oldHolidaysArr, holidays);
          const { createNewSchedule, deleteOldSchedule } = schedule;

          await this.existReservationWithSchedule(lectureId, deleteOldSchedule);

          const { duration } = await this.prismaService.lecture.findFirst({
            where: { id: lectureId },
            select: { duration: true },
          });
          const lectureHolidayInputData = this.createLectureHolidayInputData(
            lectureId,
            holidays,
          );
          const createNewScheduleInputData =
            this.createLectureScheduleInputData(
              lectureId,
              createNewSchedule,
              duration,
            );

          const deletedOldSchedule =
            await this.lectureRepository.trxDeleteManyOldSchedule(
              transaction,
              lectureId,
              deleteOldSchedule,
            );
          const createdHolidaySchedule =
            await this.lectureRepository.trxCreateLectureSchedule(
              transaction,
              createNewScheduleInputData,
            );

          const deletedLectureHoliday =
            await this.lectureRepository.trxDeleteManyLectureHoliday(
              transaction,
              lectureId,
            );
          const createdLectureHoliday =
            await this.lectureRepository.trxCreateLectureHoliday(
              transaction,
              lectureHolidayInputData,
            );
        }

        if (images) {
          const lectureImageInputData: LectureImageInputData[] =
            this.createLectureImageInputData(lectureId, images);

          await this.lectureRepository.trxDeleteLectureImage(
            transaction,
            lectureId,
          );
          await this.lectureRepository.trxCreateLectureImage(
            transaction,
            lectureImageInputData,
          );
        }

        if (coupons) {
          await this.getValidCouponIds(coupons);

          const lectureCounponTargetInputData =
            this.createLectureCouponTargetInputData(lectureId, coupons);

          await this.lectureRepository.trxDeleteLectureCouponTarget(
            transaction,
            lectureId,
          );

          await this.lectureRepository.trxCreateLectureCouponTarget(
            transaction,
            lectureCounponTargetInputData,
          );
        }

        return updatedLecture;
      },
    );
  }

  async readManyLectureSchedule(lectureId: number) {
    const calendar = await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const isOneDay = await transaction.lecture.findFirst({
          where: { id: lectureId },
          select: { lectureMethod: { select: { name: true } } },
        });

        if (isOneDay.lectureMethod.name === '원데이') {
          const schedule =
            await this.lectureRepository.trxReadManyLectureSchedule(
              transaction,
              lectureId,
            );
          const holiday =
            await this.lectureRepository.trxReadManyLectureHoliday(
              transaction,
              lectureId,
            );
          const daySchedule = await this.lectureRepository.trxReadDaySchedule(
            transaction,
            lectureId,
          );

          if (!daySchedule[0]) {
            return { schedule, holiday };
          }
          return { schedule, holiday, daySchedule };
        } else {
          const regularSchedule =
            await this.lectureRepository.trxReadManyRegularLectureSchedules(
              transaction,
              lectureId,
            );
          const holiday =
            await this.lectureRepository.trxReadManyLectureHoliday(
              transaction,
              lectureId,
            );

          return { regularSchedule, holiday };
        }
      },
    );

    const { schedule, daySchedule, regularSchedule, holiday } = calendar;

    return new CombinedScheduleDto(
      schedule,
      daySchedule,
      regularSchedule,
      holiday,
    );
  }

  async readLectureReservationWithUser(userId: number, lectureId: number) {
    const reservation =
      await this.lectureRepository.readLectureReservationWithUser(
        userId,
        lectureId,
      );

    if (!reservation) {
      throw new NotFoundException('Reservation Not Found');
    }

    return reservation;
  }

  async readManyEnrollLectureWithUserId(
    userId: number,
    { year, month }: ReadManyEnrollLectureQueryDto,
  ) {
    const startDate = new Date(year, month - 1, 2, -15);
    const endDate = new Date(year, month, 1, 8, 59, 59, 999);

    const existEnrollLecture = await this.prismaService.reservation.findFirst({
      where: { userId, isEnabled: true },
    });
    if (!existEnrollLecture) {
      return;
    }

    const onedaySchedules = await this.lectureRepository.getEnrollSchedule(
      userId,
      startDate,
      endDate,
    );

    const regularSchedules =
      await this.lectureRepository.getEnrollRegularSchedule(
        userId,
        startDate,
        endDate,
      );

    const schedules = [...onedaySchedules, ...regularSchedules];

    return schedules.map((schedule) => new EnrollLectureScheduleDto(schedule));
  }

  async getDetailEnrollSchedule(
    scheduleId: number,
    userId: number,
    { type }: EnrollScheduleDetailQueryDto,
  ) {
    const enrollScheduleDetail =
      type === '원데이'
        ? await this.lectureRepository.getDetailEnrollSchedule(
            scheduleId,
            userId,
          )
        : await this.lectureRepository.getDetailEnrollRegularSchedule(
            scheduleId,
            userId,
          );

    if (!enrollScheduleDetail) {
      throw new BadRequestException('Does not exist schedule');
    }

    return new DetailEnrollScheduleDto(enrollScheduleDetail);
  }

  async readManyLectureSchedulesWithLecturerId(
    lecturerId: number,
    query: ReadManyLectureScheduleQueryDto,
  ) {
    const where = { lecture: { lecturerId } };
    const { year, month } = query;
    const startDate = new Date(year, month - 1, 2, -15);
    const endDate = new Date(year, month, 1, 8, 59, 59, 999);

    where['startDateTime'] = {
      gte: startDate,
      lte: endDate,
    };

    return await this.lectureRepository.readManyLectureSchedulesWithLecturerId(
      where,
    );
  }

  async readManyDailySchedulesWithLecturerId(lecturerId: number, date: Date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setHours(32, 59, 59, 999);

    const where = {
      lecture: { lecturerId, deletedAt: null },
      startDateTime: { gte: startDate, lte: endDate.toISOString() },
    };

    return await this.lectureRepository.readManyDailySchedulesWithLecturerId(
      where,
    );
  }

  async getLastRegistSchedule(
    authorizedData: ValidateResult,
    targetId: number,
  ) {
    const { userId, lecturerId } = this.createUserIdAndLecturerId(
      authorizedData,
      targetId,
    );

    const [lectureSchedule, regularLectureSchedule] = await Promise.all([
      this.lectureRepository.getLastSchedule(userId, lecturerId),
      this.lectureRepository.getLastRegularSchedule(userId, lecturerId),
    ]);

    if (lectureSchedule && !regularLectureSchedule) {
      return new EnrolledLectureScheduleDto(lectureSchedule);
    } else if (!lectureSchedule && regularLectureSchedule) {
      return new EnrolledLectureScheduleDto(regularLectureSchedule);
    } else if (!lectureSchedule && !regularLectureSchedule) {
      throw new NotFoundException('Last schedule was not found');
    }

    const lastSchedule =
      lectureSchedule.startDateTime > regularLectureSchedule.startDateTime
        ? lectureSchedule
        : regularLectureSchedule;

    return new EnrolledLectureScheduleDto(lastSchedule);
  }

  private createUserIdAndLecturerId(
    authorizedData: ValidateResult,
    targetId: number,
  ) {
    let userId: number;
    let lecturerId: number;

    if (authorizedData.user) {
      userId = authorizedData.user.id;
      lecturerId = targetId;
    } else {
      userId = targetId;
      lecturerId = authorizedData.lecturer.id;
    }

    return { userId, lecturerId };
  }

  private async getValidRegionIds(regions: string[]): Promise<Id[]> {
    const extractRegions: Region[] = this.extractRegions(regions);
    const regionIds: Id[] = await this.lectureRepository.getRegionsId(
      extractRegions,
    );
    if (regionIds.length !== extractRegions.length) {
      throw new BadRequestException(
        `유효하지 않은 주소입니다.`,
        'InvalidAddress',
      );
    }

    return regionIds;
  }

  private extractRegions(regions) {
    const extractedRegions: Region[] = regions.map((region) => {
      const addressParts = region.split(' ');
      let administrativeDistrict = null;
      let district = null;

      if (
        addressParts[0] === '세종특별자치시' ||
        addressParts[0] === '온라인'
      ) {
        return { administrativeDistrict: addressParts[0] };
      }

      if (addressParts[0].endsWith('시') || addressParts[0].endsWith('도')) {
        administrativeDistrict = addressParts.shift();
      } else {
        throw new BadRequestException(
          `잘못된 주소형식입니다.`,
          'InvalidAddressFormat',
        );
      }

      if (
        addressParts[0].endsWith('시') ||
        addressParts[0].endsWith('군') ||
        addressParts[0].endsWith('구')
      ) {
        district = addressParts.shift();
      } else if (addressParts[0] === '전' && addressParts[1] === '지역') {
        district = addressParts.join(' ');
      } else {
        throw new BadRequestException(
          '잘못된 주소형식입니다',
          'InvalidAddressFormat',
        );
      }

      return { administrativeDistrict, district };
    });

    return extractedRegions;
  }

  private createLectureToRegionInputData(
    lectureId: number,
    regionIds: Id[],
  ): LectureToRegionInputData[] {
    const lectureInputData: LectureToRegionInputData[] = regionIds.map(
      (regionId) => ({
        lectureId,
        regionId: regionId.id,
      }),
    );

    return lectureInputData;
  }

  private createLectureToRegionFindData(regionIds: Id[]) {
    const regionFindData = regionIds.map((regionId) => regionId.id);

    return regionFindData;
  }

  private createLectureImageInputData(lectureId: number, imageUrls: string[]) {
    const imageInputData: LectureImageInputData[] = imageUrls.map((url) => ({
      lectureId: lectureId,
      imageUrl: url,
    }));
    return imageInputData;
  }

  private createLectureScheduleInputData(
    lectureId: number,
    schedules: Date[],
    duration: number,
  ) {
    const scheduleInputData: LectureScheduleInputData[] = schedules.map(
      (date) => {
        const startDateTime = new Date(date);
        const endDateTime = new Date(
          startDateTime.getTime() + duration * 60 * 1000,
        );
        const day = startDateTime.getDay();

        return {
          lectureId: lectureId,
          day,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
          numberOfParticipants: 0,
        };
      },
    );
    return scheduleInputData;
  }

  private createLectureHolidayInputData(lectureId: number, holidays: Date[]) {
    const holidayInputData: LectureHolidayInputData[] = holidays.map(
      (date) => ({
        lectureId: lectureId,
        holiday: new Date(date),
      }),
    );
    return holidayInputData;
  }

  private async createLecturerDanceGenreInputData(
    lectureId: number,
    genres: DanceCategory[],
    etcGenres: string[],
  ): Promise<LectureToDanceGenreInputData[]> {
    const danceCategoryIds: number[] = await this.getDanceCategoryIds(genres);
    const lectureInputData: LectureToDanceGenreInputData[] =
      danceCategoryIds.map((danceCategoryId: number) => ({
        lectureId,
        danceCategoryId,
      }));

    if (etcGenres) {
      const etcGenreId: number = await this.cacheManager.get('기타');
      const etcGenreData = etcGenres.map((etcGenre: string) => ({
        lectureId,
        danceCategoryId: etcGenreId,
        name: etcGenre,
      }));

      lectureInputData.push(...etcGenreData);
    }

    return lectureInputData;
  }

  private createSchedulesFindData(schedules: string[]) {
    const scheduleFindData = schedules.map((date) => new Date(date));

    return scheduleFindData;
  }

  private createPriceFindData(priceRange: number[]) {
    const price = {};
    if (priceRange[0]) {
      price['gte'] = priceRange[0] / 1;
    }
    if (priceRange[1]) {
      price['lte'] = priceRange[1] / 1;
    }

    return price;
  }

  private async getDanceCategoryIds(
    genres: DanceCategory[],
  ): Promise<number[]> {
    const danceCategoryIds: number[] = await Promise.all(
      genres.map(async (genre: DanceCategory) => {
        const danceCategoryId: number = await this.cacheManager.get(
          DanceCategory[genre],
        );

        return danceCategoryId;
      }),
    );

    return danceCategoryIds;
  }

  private async getLectureMethodId(method: string): Promise<number> {
    const lectureMethodId = await this.prismaService.lectureMethod.findFirst({
      where: { name: method },
      select: { id: true },
    });

    if (!lectureMethodId) {
      throw new BadRequestException('잘못된 강의 메소드입니다.');
    }

    return lectureMethodId.id;
  }

  private async getLectureTypeId(type: string): Promise<number> {
    const lectureTypeId = await this.prismaService.lectureType.findFirst({
      where: { name: type },
      select: { id: true },
    });

    if (!lectureTypeId) {
      throw new BadRequestException('잘못된 강의 타입입니다.');
    }

    return lectureTypeId.id;
  }

  private createRegularLectureStatusInputData(
    lectureId: number,
    regularSchedule: RegularLectureSchedules,
  ) {
    return {
      lectureId,
      day: regularSchedule.day,
      dateTime: regularSchedule.dateTime,
    };
  }

  private createRegularLectureSchedulesInputData(
    regularLectureStatusId: number,
    regularSchedules: Date[],
    duration: number,
  ) {
    const regularLectureSchedulesInputData = regularSchedules.map((date) => {
      const startDateTime = new Date(date);
      const endDateTime = new Date(
        startDateTime.getTime() + duration * 60 * 1000,
      );
      const day = startDateTime.getDay();

      return {
        regularLectureStatusId,
        startDateTime,
        endDateTime,
        day,
      };
    });

    return regularLectureSchedulesInputData;
  }
  private createLectureCouponTargetInputData(
    lectureId: number,
    coupons: number[],
  ) {
    const lectureCouponTargetInputData: LectureCouponTargetInputData[] =
      coupons.map((coupon) => ({
        lectureCouponId: coupon,
        lectureId: lectureId,
      }));
    return lectureCouponTargetInputData;
  }

  private createLectureHolidayArr(holiday: LectureHoliday[]) {
    const holidays = [];

    holiday.map((holidayObj) => {
      const { holiday } = holidayObj;
      holidays.push(holiday);
    });

    return holidays;
  }

  private compareHolidays(oldHolidays: Date[], newHolidays: Date[]) {
    const deleteOldSchedule = newHolidays.filter(
      (newHoliday) =>
        !oldHolidays.some(
          (oldHoliday) =>
            new Date(oldHoliday).toISOString() ===
            new Date(newHoliday).toISOString(),
        ),
    );

    const createNewSchedule = oldHolidays.filter(
      (oldHoliday) =>
        !newHolidays.some(
          (newHoliday) =>
            new Date(newHoliday).toISOString() ===
            new Date(oldHoliday).toISOString(),
        ),
    );

    return { createNewSchedule, deleteOldSchedule };
  }

  private async getValidCouponIds(coupons: number[]): Promise<void> {
    const couponDoesNotExist = [];
    for (const coupon of coupons) {
      const existCoupon = await this.prismaService.lectureCoupon.findFirst({
        where: { id: coupon },
      });
      if (!existCoupon) {
        couponDoesNotExist.push(coupon);
      }
    }
    if (couponDoesNotExist[0]) {
      throw new BadRequestException(
        `존재하지 않는 쿠폰 ${couponDoesNotExist} 포함되어 있습니다.`,
      );
    }
  }

  private async existReservationWithSchedule(
    lectureId: number,
    deletedOldSchedules: Date[],
  ) {
    const reservation = [];
    for (const oldSchedule of deletedOldSchedules) {
      const existReservation =
        await this.lectureRepository.readScheduleReservation(
          lectureId,
          new Date(oldSchedule),
        );
      if (existReservation) {
        reservation.push(oldSchedule);
      }
    }

    if (reservation[0]) {
      throw new BadRequestException(`existReservation ${reservation}`);
    }
  }

  async getLectureLearnerList(
    lecturerId: number,
    { take, lastItemId }: GetLectureLearnerListDto,
    lectureId: number,
  ): Promise<LectureLearnerDto[]> {
    const cursor = lastItemId ? { id: lastItemId } : undefined;

    const lecturerLearnerList =
      await this.lectureRepository.getLectureLearnerList(
        lecturerId,
        lectureId,
        take,
        cursor,
      );

    return lecturerLearnerList.map(
      (lecturerLearner) => new LectureLearnerDto(lecturerLearner),
    );
  }

  async getLectureScheduleLearnersInfo(
    lecturerId: number,
    lectureId: number,
    scheduleId: number,
  ): Promise<LectureLearnerInfoDto[]> {
    const learnerList: Reservation[] = await this.getTargetScheduleLearners(
      lecturerId,
      lectureId,
      scheduleId,
    );
    if (!learnerList.length) {
      return null;
    }

    const lectureLearnerInfoList: LectureLearnerInfoDto[] = await Promise.all(
      learnerList.map(async (learner: Reservation) => {
        const learnerInfo = await this.lectureRepository.getLecturerLearnerInfo(
          learner.userId,
        );
        return new LectureLearnerInfoDto({ ...learner, ...learnerInfo });
      }),
    );

    return lectureLearnerInfoList;
  }

  private async getTargetScheduleLearners(
    lecturerId: number,
    lectureId: number,
    scheduleId: number,
  ): Promise<Reservation[]> {
    const selectedLecture = await this.validateLectureOwnership(
      lecturerId,
      lectureId,
    );

    return this.lectureRepository.getLectureScheduleLearnerList(
      lecturerId,
      selectedLecture.lectureMethodId,
      scheduleId,
    );
  }

  private async validateLectureOwnership(
    lecturerId: number,
    lectureId: number,
  ) {
    const selectedLecture = await this.lectureRepository.getLectureById(
      lectureId,
    );

    if (!selectedLecture) {
      throw new NotFoundException(
        '존재하지 않는 강의입니다.',
        'NotFoundLecture',
      );
    }

    if (selectedLecture.lecturerId !== lecturerId) {
      throw new BadRequestException(
        '해당 강의의 접근 권한이 없습니다.',
        'NotLectureAuthor',
      );
    }

    return selectedLecture;
  }

  async getEnrollLectureList(
    userId: number,
    query: GetEnrollLectureListQueryDto,
  ) {
    const { type, page, pageSize } = query;
    const where = { userId, isEnabled: true };
    const currentTime = new Date();
    const skip = page * pageSize;
    const take = pageSize;

    if (type === '진행중') {
      where['OR'] = [
        {
          lectureSchedule: {
            startDateTime: {
              gte: currentTime,
            },
          },
        },
        {
          regularLectureStatus: {
            regularLectureSchedule: {
              some: {
                startDateTime: {
                  gte: currentTime,
                },
              },
            },
          },
        },
      ];
    } else {
      where['OR'] = [
        {
          lectureSchedule: {
            startDateTime: {
              lte: currentTime,
            },
          },
        },
        {
          regularLectureStatus: {
            regularLectureSchedule: {
              every: {
                startDateTime: {
                  lte: currentTime,
                },
              },
            },
          },
        },
      ];
    }

    const enrollLectureList = await this.lectureRepository.getEnrollLectureList(
      where,
      skip,
      take,
    );

    const countEnrollLecture = await this.lectureRepository.countEnrollLecture(
      where,
    );

    const count = countEnrollLecture;

    if (!count) {
      return new CombinedEnrollLectureWithCountDto(enrollLectureList);
    }

    return new CombinedEnrollLectureWithCountDto(enrollLectureList, count);
  }
}
