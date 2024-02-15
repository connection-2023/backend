import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Region, TemporaryLecture } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { LectureTemporarilySaveRepository } from '@src/lecture/repositories/temporary-lecture.repository';
import { Id, PrismaTransaction } from '@src/common/interface/common-interface';
import {
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
    const temporaryLectureCount =
      await this.prismaService.temporaryLecture.count({
        where: { lecturerId },
      });

    if (temporaryLectureCount >= 5) {
      throw new BadRequestException('더 이상 임시저장을 생성할 수 없습니다.');
    }
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
      location,
      schedules,
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
        const dayLecture =
          await this.prismaService.temporaryLectureDay.findFirst({
            where: { lectureId },
          });
        const dateLecture =
          await this.prismaService.temporaryLectureSchedule.findFirst({
            where: { lectureId },
          });

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

        if (location) {
          await this.temporaryLectureRepository.trxUpsertTemporaryLectureLocation(
            transaction,
            lectureId,
            location?.address,
            location?.detailAddress,
            location?.buildingName,
          );

          await this.temporaryLectureRepository.trxDeleteTemporaryLectureToRegions(
            transaction,
            lectureId,
          );

          if (location.address) {
            const region =
              await this.temporaryLectureRepository.trxGetTemporaryLectureRegionId(
                transaction,
                location.administrativeDistrict,
                location.district,
              );

            const temporaryLectureLocationRegionInputData = [
              { lectureId, regionId: region.id },
            ];

            await this.temporaryLectureRepository.trxCreateTemporaryLectureToRegions(
              transaction,
              temporaryLectureLocationRegionInputData,
            );
          }
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

        if (schedules) {
          if (schedules[0].date) {
            if (dayLecture) {
              await this.temporaryLectureRepository.trxDeleteTemporaryLectureDay(
                transaction,
                lectureId,
              );
            }
            if (dateLecture) {
              await this.temporaryLectureRepository.trxDeleteTemporaryLectureSchedule(
                transaction,
                lectureId,
              );
            }
            for (const schedule of schedules) {
              const temporaryLectureScheduleInputData: TemporaryLectureScheduleInputData[] =
                this.createLectureScheduleInputData(
                  lectureId,
                  schedule.date,
                  schedule.startDateTime,
                );

              await this.temporaryLectureRepository.trxCreateTemporaryLectureSchedule(
                transaction,
                temporaryLectureScheduleInputData,
              );
            }
          } else if (schedules[0].day) {
            if (dayLecture) {
              await this.temporaryLectureRepository.trxDeleteTemporaryLectureDay(
                transaction,
                lectureId,
              );
            }
            if (dateLecture) {
              await this.temporaryLectureRepository.trxDeleteTemporaryLectureSchedule(
                transaction,
                lectureId,
              );
            }
            for (const daySchedule of schedules) {
              const { day } = daySchedule;
              const { startDateTime } = daySchedule;
              const temporaryLectureDayInputData = {
                lectureId,
                day,
              };

              const createdTemporaryLectureDay =
                await this.temporaryLectureRepository.trxCreateTemporaryLectureDay(
                  transaction,
                  temporaryLectureDayInputData,
                );
              const lectureDayId = createdTemporaryLectureDay.id;
              const temporaryLectureDayScheduleInputData =
                this.createLectureDayScheduleInputData(
                  lectureDayId,
                  startDateTime,
                );

              await this.temporaryLectureRepository.trxCreateTemporaryLectureDaySchedule(
                transaction,
                temporaryLectureDayScheduleInputData,
              );
            }
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
          await this.getValidCouponIds(coupons);

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

  async readOneTemporaryLecture(lecturerId: number, lectureId: number) {
    const getTemporaryLectureByLecturerId =
      await this.prismaService.temporaryLecture.findFirst({
        where: { lecturerId, id: lectureId },
      });

    if (!getTemporaryLectureByLecturerId) {
      throw new BadRequestException('접근 권한이 없습니다.');
    }

    const temporaryLecture =
      await this.temporaryLectureRepository.readOneTemporaryLecture(lectureId);
    const location =
      await this.prismaService.temporaryLectureLocation.findUnique({
        where: { lectureId },
      });
    const dateLecture =
      await this.prismaService.temporaryLectureSchedule.findFirst({
        where: { lectureId },
      });
    const dayLecture = await this.prismaService.temporaryLectureDay.findFirst({
      where: { lectureId },
    });

    if (dateLecture) {
      const temporaryLectureDateScheduleArr =
        await this.prismaService.temporaryLectureSchedule.findMany({
          where: { lectureId },
        });
      const groupedMap = new Map();

      temporaryLectureDateScheduleArr.forEach(({ date, startDateTime }) => {
        if (!groupedMap.has(date)) {
          groupedMap.set(date, { date, startDateTime: [] });
        }
        groupedMap.get(date).startDateTime.push(startDateTime);
      });

      const schedules = Array.from(groupedMap.values());

      return {
        temporaryLecture,
        location,
        schedules,
      };
    } else if (dayLecture) {
      const temporaryLectureDayArr =
        await this.prismaService.temporaryLectureDay.findMany({
          where: { lectureId },
          include: { temporaryLectureDaySchedule: true },
        });
      const schedules = [];

      for (const temporaryLectureDayObj of temporaryLectureDayArr) {
        const { day } = temporaryLectureDayObj;
        const temporaryLectureDayScheduelTransFormData = {
          day,
          startDateTime: [],
        };

        for (const {
          startDateTime,
        } of temporaryLectureDayObj.temporaryLectureDaySchedule) {
          temporaryLectureDayScheduelTransFormData['startDateTime'].push(
            startDateTime,
          );
        }
        schedules.push(temporaryLectureDayScheduelTransFormData);
      }

      return { temporaryLecture, location, schedules };
    }

    return { temporaryLecture, location };
  }

  async readManyTemporaryLecture(
    lecturerId: number,
  ): Promise<TemporaryLecture[]> {
    return await this.prismaService.temporaryLecture.findMany({
      where: { lecturerId },
    });
  }

  async deleteTemporaryLecture(
    temporaryLectureId: number,
  ): Promise<TemporaryLecture> {
    return await this.prismaService.temporaryLecture.delete({
      where: { id: temporaryLectureId },
    });
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
    date: string,
    schedules: string[],
  ) {
    const scheduleInputData: TemporaryLectureScheduleInputData[] =
      schedules.map((schedule) => {
        return {
          lectureId: lectureId,
          date,
          startDateTime: schedule,
          numberOfParticipants: 0,
        };
      });
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

  private createLectureDayScheduleInputData(
    lectureDayId: number,
    startDateTime: string[],
  ) {
    const temporaryLectureDayScheduel = startDateTime.map((time) => ({
      lectureDayId,
      startDateTime: time,
    }));
    return temporaryLectureDayScheduel;
  }
}
