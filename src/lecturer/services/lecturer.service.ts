import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateLecturerDto } from '@src/lecturer/dtos/create-lecturer.dto';
import { LecturerRepository } from '@src/lecturer/repositories/lecturer.repository';
import {
  ICursor,
  IPaginationParams,
  Id,
  PrismaTransaction,
  Region,
} from '@src/common/interface/common-interface';
import { Lecturer } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  LecturerBasicProfile,
  LecturerCoupon,
  LecturerDanceGenreInputData,
  LecturerInstagramPostInputData,
  LecturerProfile,
  LecturerProfileImageUpdateData,
  LecturerRegionInputData,
} from '@src/lecturer/interface/lecturer.interface';
import { DanceCategory } from '@src/common/enum/enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { UpdateMyLecturerProfileDto } from '@src/lecturer/dtos/update-my-lecturer-profile.dto';
import { LecturerDetailProfileDto } from '../dtos/lecturer-detail-profile.dto';
import { LecturerLearnerDto } from '@src/common/dtos/lecturer-learner.dto';
import { GetLecturerLearnerListDto } from '../dtos/get-lecturer-learner-list.dto';
import { FilterOptions, SortOptions } from '../enum/lecturer.enum';
import { LecturerLearnerListDto } from '../dtos/lecturer-learner-list.dto';
import { any } from 'joi';
// import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class LecturerService implements OnModuleInit {
  private readonly logger = new Logger(LecturerService.name);
  private readonly client;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prismaService: PrismaService,
    private readonly lecturerRepository: LecturerRepository,
    private readonly configService: ConfigService, // private readonly esService: ElasticsearchService,
  ) {}

  onModuleInit() {}

  // async getLecturers(a) {
  //   const lecturers = await this.elasticsearchGetLecturer(a);
  // }

  // private async elasticsearchGetLecturer(a) {
  //   const { hits } = await this.esService.search({
  //     index: 'lecturer',
  //     query: {
  //       bool: {
  //         should: [
  //           {
  //             match: {
  //               'genre.ngram': a,
  //             },
  //           },
  //           {
  //             match: {
  //               'genre.keyword': a,
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   });
  //   return hits.hits[0]._source;
  // }

  async createLecturer(
    userId: number,
    createLecturerDto: CreateLecturerDto,
  ): Promise<void> {
    await this.checkLecturerExist(userId);

    const {
      regions,
      genres,
      instagramPostUrls,
      etcGenres,
      profileImageUrls,
      ...lecturerData
    } = createLecturerDto;

    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const lecturer: Lecturer =
          await this.lecturerRepository.trxCreateLecturer(transaction, {
            userId,
            ...lecturerData,
          });

        Promise.all([
          await this.createLecturerRegions(transaction, lecturer.id, regions),
          await this.createLecturerInstagramPostUrls(
            transaction,
            lecturer.id,
            instagramPostUrls,
          ),
          await this.createLecturerDanceGenres(
            transaction,
            lecturer.id,
            genres,
            etcGenres,
          ),
          await this.createLecturerProfileImageUrls(
            transaction,
            lecturer.id,
            profileImageUrls,
          ),
        ]);
      },
    );
  }

  private async checkLecturerExist(userId): Promise<void> {
    const lecturer: Lecturer =
      await this.lecturerRepository.getLecturerByUserId(userId);
    if (lecturer) {
      throw new BadRequestException(
        `이미 강사정보가 생성 되었습니다.`,
        'lecturerAlreadyExists',
      );
    }
  }

  private async getValidRegionIds(regions: string[]): Promise<Id[]> {
    const extractRegions: Region[] = this.extractRegions(regions);
    const regionIds: Id[] = await this.lecturerRepository.getRegionsId(
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

  private createLecturerRegionInputData(
    lecturerId: number,
    regionIds: Id[],
  ): LecturerRegionInputData[] {
    const lecturerInputData: LecturerRegionInputData[] = regionIds.map(
      (regionId) => ({
        lecturerId,
        regionId: regionId.id,
      }),
    );

    return lecturerInputData;
  }

  private createLecturerInstagramPostInputData(
    lecturerId: number,
    instagramPostUrls: string[],
  ): LecturerInstagramPostInputData[] {
    const lecturerInstagramPostUrlsInputData: LecturerInstagramPostInputData[] =
      instagramPostUrls.map((url) => ({
        lecturerId,
        url,
      }));

    return lecturerInstagramPostUrlsInputData;
  }

  private async createLecturerDanceGenreInputData(
    lecturerId: number,
    genres: DanceCategory[],
    etcGenres: string[],
  ): Promise<LecturerDanceGenreInputData[]> {
    const danceCategoryIds: number[] = await this.getDanceCategoryIds(genres);
    const lecturerInputData: LecturerDanceGenreInputData[] =
      danceCategoryIds.map((danceCategoryId: number) => ({
        lecturerId,
        danceCategoryId,
      }));

    if (etcGenres) {
      const etcGenreId: number = await this.cacheManager.get('기타');
      const etcGenreData = etcGenres.map((etcGenre: string) => ({
        lecturerId,
        danceCategoryId: etcGenreId,
        name: etcGenre,
      }));

      lecturerInputData.push(...etcGenreData);
    }

    return lecturerInputData;
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

  async checkAvailableNickname(nickname: string): Promise<boolean> {
    const duplicatedNickname =
      await this.lecturerRepository.getLecturerNickname(nickname);

    if (duplicatedNickname) {
      return false;
    }

    return true;
  }

  async getLecturerCoupons(lecturerId: number): Promise<LecturerCoupon[]> {
    return await this.lecturerRepository.getLecturerCouponsByLecturerId(
      lecturerId,
    );
  }

  async updateLecturerNickname(
    lectureId: number,
    nickname: string,
  ): Promise<void> {
    const duplicatedNickname =
      await this.lecturerRepository.getLecturerNickname(nickname);
    if (duplicatedNickname) {
      throw new BadRequestException(
        `닉네임 중복입니다.`,
        'duplicatedLecturerNickname',
      );
    }

    await this.lecturerRepository.updateLecturerNickname(lectureId, nickname);
  }

  async getLecturerProfile(
    lecturerId: number,
  ): Promise<LecturerDetailProfileDto> {
    const lecturerProfile: LecturerDetailProfileDto =
      await this.lecturerRepository.getLecturerProfile(lecturerId);

    return new LecturerDetailProfileDto(lecturerProfile);
  }

  async getLecturerBasicProfile(
    lecturerId: number,
  ): Promise<LecturerBasicProfile> {
    return await this.lecturerRepository.getLecturerBasicProfile(lecturerId);
  }

  async updateMyLecturerProfile(
    lecturerId: number,
    updateMyLecturerProfileDto: UpdateMyLecturerProfileDto,
  ): Promise<void> {
    const {
      newProfileImageUrls,
      genres,
      etcGenres,
      regions,
      instagramPostUrls,
      ...lecturerUpdateData
    } = updateMyLecturerProfileDto;

    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        await this.lecturerRepository.trxUpdateLecturer(
          transaction,
          lecturerId,
          { ...lecturerUpdateData },
        );

        Promise.all([
          await this.updateLecturerProfileImageUrls(
            transaction,
            lecturerId,
            newProfileImageUrls,
          ),
          await this.updateLecturerDanceGenres(
            transaction,
            lecturerId,
            genres,
            etcGenres,
          ),
          await this.updateLecturerRegions(transaction, lecturerId, regions),
          await this.updateLecturerInstagramPostUrls(
            transaction,
            lecturerId,
            instagramPostUrls,
          ),
        ]);
      },
    );
  }

  private async updateLecturerRegions(
    transaction: PrismaTransaction,
    lecturerId: number,
    regions: string[],
  ): Promise<void> {
    try {
      if (regions) {
        await this.lecturerRepository.trxDeleteLecturerRegions(
          transaction,
          lecturerId,
        );

        await this.createLecturerRegions(transaction, lecturerId, regions);
      }
    } catch (error) {
      throw error;
    }
  }

  private async createLecturerRegions(
    transaction: PrismaTransaction,
    lecturerId: number,
    regions: string[],
  ): Promise<void> {
    if (regions) {
      const regionIds: Id[] = await this.getValidRegionIds(regions);
      const lecturerRegionInputData = await this.createLecturerRegionInputData(
        lecturerId,
        regionIds,
      );

      await this.lecturerRepository.trxCreateLecturerRegions(
        transaction,
        lecturerRegionInputData,
      );
    }
  }

  private async updateLecturerDanceGenres(
    transaction: PrismaTransaction,
    lecturerId: number,
    genres: DanceCategory[],
    etcGenres: string[],
  ): Promise<void> {
    try {
      if (genres) {
        await this.lecturerRepository.trxDeleteLecturerDanceGenres(
          transaction,
          lecturerId,
        );

        await this.createLecturerDanceGenres(
          transaction,
          lecturerId,
          genres,
          etcGenres,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  private async createLecturerDanceGenres(
    transaction: PrismaTransaction,
    lecturerId: number,
    genres: DanceCategory[],
    etcGenres: string[],
  ): Promise<void> {
    try {
      const lecturerDanceGenreInputData: LecturerDanceGenreInputData[] =
        await this.createLecturerDanceGenreInputData(
          lecturerId,
          genres,
          etcGenres,
        );

      await this.lecturerRepository.trxCreateLecturerDanceGenres(
        transaction,
        lecturerDanceGenreInputData,
      );
    } catch (error) {
      throw error;
    }
  }

  private async createLecturerProfileImageUrls(
    transaction: PrismaTransaction,
    lecturerId: number,
    profileImageUrls: string[],
  ): Promise<void> {
    try {
      if (profileImageUrls) {
        const lecturerProfileImageUrlInputData: LecturerProfileImageUpdateData[] =
          this.generateLecturerProfileUpdateData(lecturerId, profileImageUrls);

        await this.lecturerRepository.trxCreateLecturerProfileImages(
          transaction,
          lecturerProfileImageUrlInputData,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  private generateLecturerProfileUpdateData(
    lecturerId: number,
    newProfileImageUrls: string[],
  ): LecturerProfileImageUpdateData[] {
    const updateData: LecturerProfileImageUpdateData[] =
      newProfileImageUrls.map((profileImageUrl) => ({
        lecturerId,
        url: profileImageUrl,
      }));

    return updateData;
  }

  private async updateLecturerProfileImageUrls(
    transaction: PrismaTransaction,
    lecturerId: number,
    profileImageUrls: string[],
  ): Promise<void> {
    try {
      if (profileImageUrls) {
        await this.lecturerRepository.trxDeleteLecturerProfileImages(
          transaction,
          lecturerId,
        );
        await this.createLecturerProfileImageUrls(
          transaction,
          lecturerId,
          profileImageUrls,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  private async updateLecturerInstagramPostUrls(
    transaction: PrismaTransaction,
    lecturerId: number,
    instagramPostUrls: string[],
  ): Promise<void> {
    try {
      if (instagramPostUrls) {
        await this.lecturerRepository.trxDeleteLecturerInstagramPostUrls(
          transaction,
          lecturerId,
        );
        await this.createLecturerInstagramPostUrls(
          transaction,
          lecturerId,
          instagramPostUrls,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  private async createLecturerInstagramPostUrls(
    transaction: PrismaTransaction,
    lecturerId: number,
    instagramPostUrls: string[],
  ): Promise<void> {
    try {
      if (instagramPostUrls) {
        const lecturerInstagramPostInputData: LecturerInstagramPostInputData[] =
          this.createLecturerInstagramPostInputData(
            lecturerId,
            instagramPostUrls,
          );
        await this.lecturerRepository.trxCreateLecturerInstagramPost(
          transaction,
          lecturerInstagramPostInputData,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async getLecturerLearners(
    lecturerId: number,
    {
      sortOption,
      filterOption,
      take,
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
      lectureId,
    }: GetLecturerLearnerListDto,
  ): Promise<LecturerLearnerListDto> {
    const { orderBy, user } = await this.getLectureLearnerFilterOptions(
      sortOption,
      filterOption,
      lectureId,
    );

    const paginationParams: IPaginationParams = this.getPaginationParams(
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
      take,
    );

    const totalItemCount: number =
      await this.lecturerRepository.getLecturerLearnerCount(lecturerId, user);
    if (!totalItemCount) {
      return new LecturerLearnerListDto({ totalItemCount });
    }

    const selectedLearners = await this.lecturerRepository.getLecturerLeaners(
      lecturerId,
      paginationParams,
      orderBy,
      user,
    );

    const lecturerLearnerList = await Promise.all(
      selectedLearners.map(async (selectedLearner) => {
        const reservation = await this.lecturerRepository.getUserReservation(
          selectedLearner.userId,
        );
        return { ...selectedLearner, reservation };
      }),
    );

    return new LecturerLearnerListDto({
      totalItemCount,
      lecturerLearnerList,
    });
  }

  private getLectureLearnerFilterOptions(
    sortOption: SortOptions,
    filterOption: FilterOptions,
    lectureId: number,
  ) {
    let orderBy;
    const user = { reservation: {} };
    const currentDate = new Date();

    switch (sortOption) {
      case SortOptions.ASC:
        orderBy = { user: { nickname: 'asc' } };
        break;

      case SortOptions.HIGHEST_APPLICANTS:
        orderBy = [{ enrollmentCount: 'desc' }, { id: 'desc' }];
        break;

      case SortOptions.LATEST:
        orderBy = { id: 'desc' };
        break;
    }

    switch (filterOption) {
      case FilterOptions.IN_PROGRESS:
        user.reservation = {
          some: {
            lectureSchedule: {
              lectureId,
              startDateTime: { gt: currentDate },
            },
          },
        };
        break;

      case FilterOptions.COMPLETED:
        user.reservation = {
          some: { lectureSchedule: { lectureId } },
          every: { lectureSchedule: { startDateTime: { lt: currentDate } } },
        };
        break;
    }

    return { orderBy, user };
  }

  private getPaginationParams(
    currentPage: number,
    targetPage: number,
    firstItemId: number,
    lastItemId: number,
    take: number,
  ): IPaginationParams {
    let cursor;
    let skip;
    let updatedTake = take;

    const isPagination = currentPage && targetPage;
    const isInfiniteScroll = lastItemId && take;

    if (isPagination) {
      const pageDiff = currentPage - targetPage;
      cursor = { id: pageDiff <= -1 ? lastItemId : firstItemId };
      skip = Math.abs(pageDiff) === 1 ? 1 : (Math.abs(pageDiff) - 1) * take + 1;
      updatedTake = pageDiff >= 1 ? -take : take;
    } else if (isInfiniteScroll) {
      cursor = { id: lastItemId };
      skip = 1;
    }

    return { cursor, skip, take: updatedTake };
  }
}
