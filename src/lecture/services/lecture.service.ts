import { LecturerRepository } from '@src/lecturer/repositories/lecturer.repository';
import { LectureRepository } from '@src/lecture/repositories/lecture.repository';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateLectureDto } from '@src/lecture/dtos/create-lecture.dto';
import { Lecture, LectureHoliday, Region } from '@prisma/client';
import { ReadManyLectureQueryDto } from '@src/lecture/dtos/read-many-lecture-query.dto';
import { UpdateLectureDto } from '@src/lecture/dtos/update-lecture.dto';
import { QueryFilter } from '@src/common/filters/query.filter';
import { PrismaService } from '@src/prisma/prisma.service';
import { PrismaTransaction, Id } from '@src/common/interface/common-interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  LectureCouponTargetInputData,
  LectureHolidayInputData,
  LectureImageInputData,
  LectureScheduleInputData,
  LectureToDanceGenreInputData,
  LectureToRegionInputData,
  RegularLectureScheduleInputData,
  RegularLectureSchedules,
} from '../interface/lecture.interface';
import { Cache } from 'cache-manager';
import { DanceCategory } from '@src/common/enum/enum';
import { CouponRepository } from '@src/coupon/repository/coupon.repository';

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

        const lectureLocationInputData = {
          lectureId: newLecture.id,
          ...location,
        };

        await this.lectureRepository.trxCreateLectureLocation(
          transaction,
          lectureLocationInputData,
        );

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
          const regularLectureScheduleInputData: RegularLectureScheduleInputData[] =
            this.createRegularLectureScheduleInputData(
              newLecture.id,
              regularSchedules,
              lecture.duration,
            );
          await this.lectureRepository.trxCreateLectureSchedule(
            transaction,
            regularLectureScheduleInputData,
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

  async readLecture(lectureId: number) {
    const lecture = await this.lectureRepository.readLecture(lectureId);
    const lecturer = await this.lecturerRepository.getLecturerBasicProfile(
      lecture.lecturerId,
    );
    const lectureLocation = await this.lectureRepository.readLectureLocation(
      lectureId,
    );

    return { lecture, lecturer, lectureLocation };
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

    return await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
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
          const { duration } = await this.prismaService.lecture.findFirst({
            where: { id: lectureId },
            select: { duration: true },
          });

          const deletedOldSchedule =
            await this.lectureRepository.trxDeleteManyOldSchedule(
              transaction,
              lectureId,
              deleteOldSchedule,
            );
          const createNewScheduleInputData =
            this.createLectureScheduleInputData(
              lectureId,
              createNewSchedule,
              duration,
            );
          const createdHolidaySchedule =
            await this.lectureRepository.trxCreateLectureSchedule(
              transaction,
              createNewScheduleInputData,
            );
        }

        if (notification) {
          await transaction.lectureNotification.upsert({
            where: { lectureId },
            create: { lectureId, notification },
            update: { notification },
          });
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
          for (const couponId of coupons) {
            const lectureCoupon = await this.couponRepository.getLectureCoupon(
              couponId,
            );

            if (!lectureCoupon) {
              throw new BadRequestException('해당 쿠폰은 존재하지 않습니다.');
            }
          }

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

  private createLectureHolidayInputData(lectureId: number, holidays: string[]) {
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
    regularSchedules: RegularLectureSchedules,
    duration: number,
  ) {
    const regularScheduleInputData = [];
    for (const team in regularSchedules) {
      regularSchedules[team].map((date) => {
        const startDateTime = new Date(date);
        const endDateTime = new Date(
          startDateTime.getTime() + duration * 60 * 60 * 1000,
        );
        const regularSchedule = {
          lectureId,
          team,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
          numberOfParticipants: 0,
        };
        regularScheduleInputData.push(regularSchedule);
      });
    }

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
}
