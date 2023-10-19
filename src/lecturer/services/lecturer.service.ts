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
  AwsS3DeleteParam,
  AwsS3Param,
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
  ProfileImageData,
} from '@src/lecturer/interface/lecturer.interface';
import { DanceCategory } from '@src/common/enum/enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { UpdateMyLecturerProfileDto } from '@src/lecturer/dtos/update-my-lecturer-profile.dto';

@Injectable()
export class LecturerService implements OnModuleInit {
  private readonly logger = new Logger(LecturerService.name);
  private awsS3: AWS.S3;
  private awsS3BucketName: string;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prismaService: PrismaService,
    private readonly lecturerRepository: LecturerRepository,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.awsS3 = new AWS.S3({
      accessKeyId: this.configService.get<'string'>('AWS_S3_ACCESS_KEY'),
      secretAccessKey: this.configService.get<'string'>('AWS_S3_SECRET_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.awsS3BucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

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

    const regionIds: Id[] = await this.getValidRegionIds(regions);

    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const lecturer: Lecturer =
          await this.lecturerRepository.trxCreateLecturer(transaction, {
            userId,
            ...lecturerData,
          });

        const lecturerRegionInputData: LecturerRegionInputData[] =
          this.createLecturerRegionInputData(lecturer.id, regionIds);
        await this.lecturerRepository.trxCreateLecturerRegions(
          transaction,
          lecturerRegionInputData,
        );

        if (websiteUrls) {
          const lecturerWebsiteInputData: LecturerWebsiteInputData[] =
            this.createLecturerWebsiteInputData(lecturer.id, websiteUrls);
          await this.lecturerRepository.trxCreateLecturerWebsiteUrls(
            transaction,
            lecturerWebsiteInputData,
          );
        }

        const lecturerDanceGenreInputData: LecturerDanceGenreInputData[] =
          await this.createLecturerDanceGenreInputData(
            lecturer.id,
            genres,
            etcGenres,
          );
        await this.lecturerRepository.trxCreateLecturerDanceGenres(
          transaction,
          lecturerDanceGenreInputData,
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

      if (addressParts[0] === '세종특별자치시') {
        administrativeDistrict = addressParts.shift();
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
      } else {
        throw new BadRequestException(
          `잘못된 주소형식입니다`,
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

  private createLecturerProfileImageInputData(
    lecturerId: number,
    profileImageUrls: string[],
  ): LecturerProfileImageInputData[] {
    const lecturerProfileImageUrls: LecturerProfileImageInputData[] =
      profileImageUrls.map((profileImageUrl) => ({
        lecturerId,
        url: profileImageUrl,
      }));

    return lecturerProfileImageUrls;
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
    const { newProfileImageUrls } = updateMyLecturerProfileDto;

    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        await this.createLecturerProfileImageUrls(
          transaction,
          lecturerId,
          newProfileImageUrls,
        );
      },
    );
  }

  private async createLecturerProfileImageUrls(
    transaction: PrismaTransaction,
    lecturerId: number,
    profileImageUrls: string[],
  ) {
    const lecturerProfileImageUrlInputData: LecturerProfileImageUpdateData[] =
      await this.createLecturerProfileUpdateData(lecturerId, profileImageUrls);

    await this.lecturerRepository.trxCreateLecturerProfileImages(
      transaction,
      lecturerProfileImageUrlInputData,
    );
  }

  private createLecturerProfileUpdateData(
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
}
