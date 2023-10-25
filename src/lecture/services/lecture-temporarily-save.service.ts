import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Region, TemporaryLecture } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { LectureTemporarilySaveRepository } from '@src/lecture/repositories/temporary-lecture.repository';
import { Id, PrismaTransaction } from '@src/common/interface/common-interface';
import {
  RegularTemporaryLectureScheduleInputData,
  RegularTemporaryLectureSchedules,
  TemporaryLectureCouponTargetInputData,
  TemporaryLectureHolidayInputData,
  TemporaryLectureImageInputData,
  TemporaryLectureScheduleInputData,
  TemporaryLectureToDanceGenreInputData,
  TemporaryLectureToRegionInputData,
} from '../interface/temporary-lecture.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DanceCategory } from '@src/common/enum/enum';
import { UpsertTemporaryLectureDto } from '../dtos/update-temporary-lecture.dto';

@Injectable()
export class LectureTemporarilySaveService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prismaService: PrismaService,
    private readonly temporaryLectureRepository: LectureTemporarilySaveRepository,
  ) {}

  async createTemporaryLecture(lecturerId: number): Promise<TemporaryLecture> {
    return await this.prismaService.temporaryLecture.create({
      data: { lecturerId },
    });
  }

  async upsertTemporaryLecture(
    upsertTemporaryLectureDto: UpsertTemporaryLectureDto,
  ) {
    const {
      lectureId,
      regions,
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
    } = upsertTemporaryLectureDto;

    return await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        if (lectureMethod) {
          lecture['lectureMethodId'] = await this.getLectureMethodId(
            lectureMethod,
          );
        }
        if (lectureType) {
          lecture['lectureTypeId'] = await this.getLectureTypeId(lectureType);
        }

        if (lecture) {
          await this.temporaryLectureRepository.trxUpdateTemporaryLecture(
            transaction,
            lectureId,
            lecture,
          );
        }

        if (regions) {
          const regionIds: Id[] = await this.getValidRegionIds(regions);
          const temporaryLectureToRegionInputData: TemporaryLectureToRegionInputData[] =
            this.createLectureToRegionInputData(lectureId, regionIds);
          await this.temporaryLectureRepository.trxDeleteTemporaryLectureToRegions(
            transaction,
            lectureId,
          );
          await this.temporaryLectureRepository.trxCreateTemporaryLectureToRegions(
            transaction,
            temporaryLectureToRegionInputData,
          );
        }

        if (schedules || regularSchedules) {
          if (lectureMethod === '원데이') {
            const temporaryLectureScheduleInputData: TemporaryLectureScheduleInputData[] =
              this.createLectureScheduleInputData(lectureId, schedules);
            await this.temporaryLectureRepository.trxDeleteTemporaryLectureSchedule(
              transaction,
              lectureId,
            );
            await this.temporaryLectureRepository.trxCreateTemporaryLectureSchedule(
              transaction,
              temporaryLectureScheduleInputData,
            );
          } else if (lectureMethod === '정기') {
            const regularTemporaryLectureScheduleInputData: RegularTemporaryLectureScheduleInputData[] =
              this.createRegularLectureScheduleInputData(
                lectureId,
                regularSchedules,
              );
            await this.temporaryLectureRepository.trxDeleteTemporaryLectureSchedule(
              transaction,
              lectureId,
            );
            await this.temporaryLectureRepository.trxCreateTemporaryLectureSchedule(
              transaction,
              regularTemporaryLectureScheduleInputData,
            );
          }
        }

        if (genres) {
          const temporaryLectureToDanceGenreInputData: TemporaryLectureToDanceGenreInputData[] =
            await this.createLecturerDanceGenreInputData(
              lectureId,
              genres,
              etcGenres,
            );

          await this.temporaryLectureRepository.trxDeleteTemporaryLectureToDanceGenres(
            transaction,
            lectureId,
          );
          await this.temporaryLectureRepository.trxCreateTemporaryLectureToDanceGenres(
            transaction,
            temporaryLectureToDanceGenreInputData,
          );
        }

        if (notification) {
          await this.temporaryLectureRepository.trxUpsertTemporaryLectureNotification(
            transaction,
            lectureId,
            notification,
          );
        }

        if (holidays) {
          const temporaryLectureHolidayInputData: TemporaryLectureHolidayInputData[] =
            this.createLectureHolidayInputData(lectureId, holidays);

          await this.temporaryLectureRepository.trxDeleteTemporaryLectureHoliday(
            transaction,
            lectureId,
          );
          await this.temporaryLectureRepository.trxCreateTemporaryLectureHoliday(
            transaction,
            temporaryLectureHolidayInputData,
          );
        }

        if (images) {
          const temporaryLectureImageInputData: TemporaryLectureImageInputData[] =
            this.createLectureImageInputData(lectureId, images);

          await this.temporaryLectureRepository.trxDeleteTemporaryLectureImage(
            transaction,
            lectureId,
          );
          await this.temporaryLectureRepository.trxCreateTemporaryLectureImage(
            transaction,
            temporaryLectureImageInputData,
          );
        }

        if (coupons) {
          const lectureCouponTargetInputData: TemporaryLectureCouponTargetInputData[] =
            this.createLectureCouponTargetInputData(lectureId, coupons);

          await this.temporaryLectureRepository.trxDeleteTemporaryLectureCouponTarget(
            transaction,
            lectureId,
          );
          await this.temporaryLectureRepository.trxCreateTemporaryLectureCouponTarget(
            transaction,
            lectureCouponTargetInputData,
          );
        }
      },
    );
  }

  private async getValidRegionIds(regions: string[]): Promise<Id[]> {
    const extractRegions: Region[] = this.extractRegions(regions);
    const regionIds: Id[] = await this.temporaryLectureRepository.getRegionsId(
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
  ): TemporaryLectureToRegionInputData[] {
    const lectureInputData: TemporaryLectureToRegionInputData[] = regionIds.map(
      (regionId) => ({
        lectureId,
        regionId: regionId.id,
      }),
    );

    return lectureInputData;
  }

  private createLectureImageInputData(lectureId: number, imageUrls: string[]) {
    const imageInputData: TemporaryLectureImageInputData[] = imageUrls.map(
      (url) => ({
        lectureId: lectureId,
        imageUrl: url,
      }),
    );
    return imageInputData;
  }

  private createLectureScheduleInputData(
    lectureId: number,
    schedules: string[],
  ) {
    const scheduleInputData: TemporaryLectureScheduleInputData[] =
      schedules.map((date) => ({
        lectureId: lectureId,
        startDateTime: new Date(date),
        numberOfParticipants: 0,
      }));
    return scheduleInputData;
  }

  private createLectureHolidayInputData(lectureId: number, holidays: string[]) {
    const holidayInputData: TemporaryLectureHolidayInputData[] = holidays.map(
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
  ): Promise<TemporaryLectureToDanceGenreInputData[]> {
    const danceCategoryIds: number[] = await this.getDanceCategoryIds(genres);
    const lectureInputData: TemporaryLectureToDanceGenreInputData[] =
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
    regularSchedules: RegularTemporaryLectureSchedules,
  ) {
    const regularScheduleInputData = [];
    for (const team in regularSchedules) {
      regularSchedules[team].map((date) => {
        const regularSchedule = {
          lectureId,
          team,
          startDateTime: new Date(date),
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
    const lectureCouponTargetInputData: TemporaryLectureCouponTargetInputData[] =
      coupons.map((coupon) => ({
        lectureCouponId: coupon,
        lectureId: lectureId,
      }));
    return lectureCouponTargetInputData;
  }
}
