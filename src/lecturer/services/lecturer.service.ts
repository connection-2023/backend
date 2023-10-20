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
  Id,
  PrismaTransaction,
  Region,
} from '@src/common/interface/common-interface';
import { Lecturer } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  LecturerCoupon,
  LecturerDanceGenreInputData,
  LecturerProfile,
  LecturerProfileImageInputData,
  LecturerProfileImageUpdateData,
  LecturerRegionInputData,
  LecturerWebsiteInputData,
} from '@src/lecturer/interface/lecturer.interface';
import { DanceCategory } from '@src/common/enum/enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { UpdateMyLecturerProfileDto } from '@src/lecturer/dtos/update-my-lecturer-profile.dto';

@Injectable()
export class LecturerService implements OnModuleInit {
  private readonly logger = new Logger(LecturerService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prismaService: PrismaService,
    private readonly lecturerRepository: LecturerRepository,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.logger.log('LecturerService Init');
  }

  async createLecturer(
    userId: number,
    createLecturerDto: CreateLecturerDto,
  ): Promise<void> {
    await this.checkLecturerExist(userId);

    const {
      regions,
      genres,
      websiteUrls,
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
        await this.createLecturerRegions(transaction, lecturer.id, regions);

        if (websiteUrls) {
          await this.createLecturerWebsiteUrls(
            transaction,
            lecturer.id,
            websiteUrls,
          );
        }

        await this.createLecturerDanceGenres(
          transaction,
          lecturer.id,
          genres,
          etcGenres,
        );

        await this.createLecturerProfileImageUrls(
          transaction,
          lecturer.id,
          profileImageUrls,
        );
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

  private createLecturerWebsiteInputData(
    lecturerId: number,
    websiteUrls: string[],
  ): LecturerWebsiteInputData[] {
    const lecturerWebsiteInputData: LecturerWebsiteInputData[] =
      websiteUrls.map((url) => ({
        lecturerId,
        url,
      }));

    return lecturerWebsiteInputData;
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

  async getLecturerProfile(lecturerId: number): Promise<LecturerProfile> {
    return await this.lecturerRepository.getLecturerProfile(lecturerId);
  }

  async updateMyLecturerProfile(
    lecturerId: number,
    updateMyLecturerProfileDto: UpdateMyLecturerProfileDto,
  ) {
    const {
      newProfileImageUrls,
      genres,
      etcGenres,
      regions,
      websiteUrls,
      ...lecturerUpdateData
    } = updateMyLecturerProfileDto;

    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        await this.lecturerRepository.trxUpdateLecturer(
          transaction,
          lecturerId,
          { ...lecturerUpdateData },
        );

        await this.updateLecturerProfileImageUrls(
          transaction,
          lecturerId,
          newProfileImageUrls,
        );
        await this.updateLecturerDanceGenres(
          transaction,
          lecturerId,
          genres,
          etcGenres,
        );
        await this.updateLecturerRegions(transaction, lecturerId, regions);
        await this.updateLecturerWebsiteUrls(
          transaction,
          lecturerId,
          websiteUrls,
        );
      },
    );
  }

  private async updateLecturerRegions(
    transaction: PrismaTransaction,
    lecturerId: number,
    regions: string[],
  ): Promise<void> {
    try {
      await this.lecturerRepository.trxDeleteLecturerRegions(
        transaction,
        lecturerId,
      );

      await this.createLecturerRegions(transaction, lecturerId, regions);
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

  private async updateLecturerWebsiteUrls(
    transaction: PrismaTransaction,
    lecturerId: number,
    websiteUrls: string[],
  ): Promise<void> {
    try {
      if (websiteUrls) {
        await this.lecturerRepository.trxDeleteLecturerWebsiteUrls(
          transaction,
          lecturerId,
        );
        await this.createLecturerWebsiteUrls(
          transaction,
          lecturerId,
          websiteUrls,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  private async createLecturerWebsiteUrls(
    transaction: PrismaTransaction,
    lecturerId: number,
    websiteUrls: string[],
  ): Promise<void> {
    try {
      const lecturerWebsiteInputData: LecturerWebsiteInputData[] =
        this.createLecturerWebsiteInputData(lecturerId, websiteUrls);
      await this.lecturerRepository.trxCreateLecturerWebsiteUrls(
        transaction,
        lecturerWebsiteInputData,
      );
    } catch (error) {
      throw error;
    }
  }
}
