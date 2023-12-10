import { LecturerRepository } from '@src/lecturer/repositories/lecturer.repository';
import { LectureRepository } from '@src/lecture/repositories/lecture.repository';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLectureDto } from '@src/lecture/dtos/create-lecture.dto';
import { Lecture, LectureHoliday, Region } from '@prisma/client';
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
import { CouponRepository } from '@src/coupon/repository/coupon.repository';
import { ReadManyEnrollLectureQueryDto } from '../dtos/read-many-enroll-lecture-query.dto';
import { ReadManyLectureProgressQueryDto } from '../dtos/read-many-lecture-progress-query.dto';

@Injectable()
export class LectureService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly lectureRepository: LectureRepository,
    private readonly lecturerRepository: LecturerRepository,
    private readonly queryFilter: QueryFilter,
    private readonly prismaService: PrismaService,
    private readonly couponRepository: CouponRepository,
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
      ...lecture
    } = createLectureDto;

    const regionIds: Id[] = await this.getValidRegionIds(regions);

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
          const lectureLocationInputData = {
            lectureId: newLecture.id,
            ...location,
          };

          await this.lectureRepository.trxCreateLectureLocation(
            transaction,
            lectureLocationInputData,
          );
        }

        const lectureToRegionInputData: LectureToRegionInputData[] =
          this.createLectureToRegionInputData(newLecture.id, regionIds);
        await this.lectureRepository.trxCreateLectureToRegions(
          transaction,
          lectureToRegionInputData,
        );

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
            const regularDayScheduleInputData =
              this.createRegularLectureScheduleInputData(
                newLecture.id,
                schedule,
                lecture.duration,
              );

            await this.lectureRepository.trxCreateLectureSchedule(
              transaction,
              regularDayScheduleInputData,
            );
          }
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

        return {
          newLecture,
        };
      },
    );
  }

  async readLectureWithUserId(userId: number, lectureId: number) {
    const lecture = await this.lectureRepository.readLecture(lectureId);
    const lecturer = await this.lecturerRepository.getLecturerBasicProfile(
      lecture.lecturerId,
    );
    const location = await this.lectureRepository.readLectureLocation(
      lectureId,
    );

    const isLike = await this.prismaService.likedLecture.findFirst({
      where: { userId, lectureId },
    });

    if (isLike) {
      lecture['isLike'] = true;
    } else {
      lecture['isLike'] = false;
    }
    return { lecture, lecturer, location };
  }

  async readLecture(lectureId: number) {
    const lecture = await this.lectureRepository.readLecture(lectureId);
    const lecturer = await this.lecturerRepository.getLecturerBasicProfile(
      lecture.lecturerId,
    );
    const location = await this.lectureRepository.readLectureLocation(
      lectureId,
    );

    return { lecture, lecturer, location };
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
    const { images, coupons, holidays, notification, ...lecture } =
      updateLectureDto;
    const currentTime = new Date();

    return await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        if (notification) {
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
          throw new BadRequestException(
            `maxCapacityIsSmallerThanParticipants ${readLectureParticipant.numberOfParticipants}`,
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
        const schedule =
          await this.lectureRepository.trxReadManyLectureSchedule(
            transaction,
            lectureId,
          );
        const holiday = await this.lectureRepository.trxReadManyLectureHoliday(
          transaction,
          lectureId,
        );

        return { schedule, holiday };
      },
    );
    const { schedule } = calendar;
    const { holiday } = calendar;
    const holidayArr = this.createLectureHolidayArr(holiday);

    return { schedule, holidayArr };
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

  async readManyLectureWithLecturerId(lecturerId: number) {
    return await this.lectureRepository.readManyLectureWithLectruerId(
      lecturerId,
    );
  }

  async readManyEnrollLectureWithUserId(
    userId: number,
    {
      take,
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
      enrollLectureType,
    }: ReadManyEnrollLectureQueryDto,
  ) {
    return await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const existEnrollLecture =
          await this.prismaService.reservation.findFirst({
            where: { userId },
          });
        if (!existEnrollLecture) {
          return;
        }

        let cursor;
        let skip;
        const currentTime = {};

        if (enrollLectureType === '수강 완료') {
          currentTime['reservation'] = {
            every: {
              lectureSchedule: {
                startDateTime: {
                  lt: new Date(),
                },
              },
            },
          };
        } else if (enrollLectureType === '진행중') {
          currentTime['reservation'] = {
            some: {
              lectureSchedule: {
                startDateTime: {
                  gt: new Date(),
                },
              },
            },
          };
        }
        const isPagination = currentPage && targetPage;

        if (isPagination) {
          const pageDiff = currentPage - targetPage;
          ({ cursor, skip, take } = this.getPaginationOptions(
            pageDiff,
            pageDiff <= -1 ? lastItemId : firstItemId,
            take,
          ));
        }

        const enrollLecture =
          await this.lectureRepository.trxReadManyEnrollLectureWithUserId(
            transaction,
            userId,
            take,
            currentTime,
            cursor,
            skip,
          );
        const count = await this.lectureRepository.trxEnrollLectureCount(
          transaction,
          userId,
        );

        return { count, enrollLecture };
      },
    );
  }

  async readManyLectureProgress(
    lecturerId: number,
    query: ReadManyLectureProgressQueryDto,
  ) {
    const { progressType } = query;
    return await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        if (progressType === '진행중') {
          const lectures =
            await this.lectureRepository.trxReadManyLectureProgress(
              transaction,
              lecturerId,
            );
          const inprogressLecture = [];

          for (const lecture of lectures) {
            const currentTime = new Date();
            const completedLectureSchedule =
              await this.lectureRepository.trxReadManyCompletedLectureScheduleCount(
                transaction,
                lecture.id,
                currentTime,
              );
            const progress = Math.round(
              (completedLectureSchedule / lecture._count.lectureSchedule) * 100,
            );
            const inprogressLectureData = {
              ...lecture,
              progress,
              allSchedule: lecture._count.lectureSchedule,
              completedSchedule: completedLectureSchedule,
            };

            inprogressLecture.push(inprogressLectureData);
          }

          return inprogressLecture;
        } else if (progressType === '마감된 클래스') {
          return await this.lectureRepository.readManyCompletedLectureWithLecturerId(
            lecturerId,
          );
        }
      },
    );
  }

  async readManyParticipantWithLectureId(lectureId: number) {
    return await this.lectureRepository.readManyParticipantWithLectureId(
      lectureId,
    );
  }

  async readManyParticipantWithScheduleId(
    lectureId: number,
    scheduleId: number,
  ) {
    await this.validateScheduleId(lectureId, scheduleId);

    const participant =
      await this.lectureRepository.readManyParticipantWithScheduleId(
        scheduleId,
      );

    return participant.reservation;
  }

  private getPaginationOptions(pageDiff: number, itemId: number, take: number) {
    const cursor = { id: itemId };

    const calculateSkipValue = (pageDiff: number) => {
      return Math.abs(pageDiff) === 1 ? 1 : (Math.abs(pageDiff) - 1) * take + 1;
    };

    const skip = calculateSkipValue(pageDiff);

    return { cursor, skip, take: pageDiff >= 1 ? -take : take };
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
          startDateTime.getTime() + duration * 60 * 60 * 1000,
        );

        return {
          lectureId: lectureId,
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

  private createRegularLectureScheduleInputData(
    lectureId: number,
    regularSchedule: RegularLectureSchedules,
    duration: number,
  ) {
    const regularScheduleInputData = regularSchedule.startDateTime.map(
      (time) => {
        const startTime = new Date(time);
        const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

        return {
          lectureId,
          day: regularSchedule.day,
          startDateTime: startTime,
          endDateTime: endTime,
          numberOfParticipants: 0,
        };
      },
    );
    return regularScheduleInputData;
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

  private async validateScheduleId(lectureId: number, scheduleId: number) {
    const schedule = await this.prismaService.lectureSchedule.findFirst({
      where: { lectureId, id: scheduleId },
    });

    if (!schedule) {
      throw new BadRequestException(
        '해당 강의에 존재하지 않는 scheduleId입니다.',
        'InvalidScheduleId',
      );
    }
  }
}
