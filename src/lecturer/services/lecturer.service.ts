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
    profileImages: Express.Multer.File[],
    createLecturerDto: CreateLecturerDto,
  ): Promise<void> {
    await this.checkLecturerExist(userId);

    const { regions, genres, websiteUrls, etcGenres, ...lecturerData } =
      createLecturerDto;

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

        const lecturerProfileImageUrlInputData: LecturerProfileImageInputData[] =
          await this.createLecturerProfileImageInputData(
            lecturer.id,
            profileImages,
          );
        await this.lecturerRepository.trxCreateLecturerProfileImages(
          transaction,
          lecturerProfileImageUrlInputData,
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

  async createLecturerProfileImageInputData(
    lecturerId: number,
    profileImages: Express.Multer.File[],
  ): Promise<LecturerProfileImageInputData[]> {
    const lecturerProfileImageUrls: LecturerProfileImageInputData[] = [];

    for (const profileImage of profileImages) {
      const key = `lecturer/${lecturerId}/${Date.now()}_${
        profileImage.originalname
      }`;

      await this.awsS3
        .putObject({
          Bucket: this.awsS3BucketName,
          Key: key,
          Body: profileImage.buffer,
          ACL: 'private',
          ContentType: profileImage.mimetype,
        })
        .promise();

      const imageUrl: string = `${this.awsS3.endpoint.href}${this.awsS3BucketName}/${key}`;

      lecturerProfileImageUrls.push({ lecturerId, url: imageUrl });
    }

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

  async getLecturerProfile(lectureId: number): Promise<LecturerProfile> {
    return await this.lecturerRepository.getLecturerProfile(lectureId);
  }

  async updateMyLecturerProfile(
    lecturerId: number,
    newProfileImages: Express.Multer.File[],
    updateMyLecturerProfileDto: UpdateMyLecturerProfileDto,
  ) {
    const { deletedProfileImageData, updatedProfileImageData } =
      updateMyLecturerProfileDto;

    if (deletedProfileImageData) {
      const awsS3Params: AwsS3DeleteParam[] = this.createAwsS3Params(
        deletedProfileImageData,
      );
      await this.deleteS3ProfileImages(awsS3Params);
      await this.deleteLecturerProfileImages(
        lecturerId,
        deletedProfileImageData,
      );
    }

    if (updatedProfileImageData) {
      const newProfileImageParams: AwsS3Param[] =
        await this.createNewProfileImageParams(lecturerId, newProfileImages);
      const lecturerProfileUpdateData: LecturerProfileImageUpdateData[] =
        await this.createLecturerProfileUpdateData(
          updatedProfileImageData,
          newProfileImageParams,
        );
      await this.lecturerRepository.updateLecturerProfileImages(
        lecturerId,
        lecturerProfileUpdateData,
      );
    }
  }

  private async deleteS3ProfileImages(
    awsS3Params: AwsS3DeleteParam[],
  ): Promise<void> {
    try {
      await Promise.all(
        awsS3Params.map((awsS3param) =>
          this.awsS3.deleteObject(awsS3param).promise(),
        ),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `${error}`,
        `failedToDeleteS3object`,
      );
    }
  }

  private createAwsS3Params(deletedProfileImageData: ProfileImageData[]) {
    try {
      return deletedProfileImageData.map((deletedProfileImage) => {
        const key = deletedProfileImage.url.replace(
          this.awsS3.endpoint.href + this.awsS3BucketName + '/',
          '',
        );

        return { Bucket: this.awsS3BucketName, Key: key };
      });
    } catch (error) {
      throw new BadRequestException(
        `올바르지 않은 s3 url형식입니다`,
        'invalidS3URLFormat',
      );
    }
  }

  private async deleteLecturerProfileImages(
    lecturerId: number,
    deletedProfileImageData: ProfileImageData[],
  ): Promise<void> {
    const profileImageIds: number[] = deletedProfileImageData.map((image) =>
      parseInt(image.profileImageId, 10),
    );

    await this.lecturerRepository.deleteLecturerProfileImages(
      lecturerId,
      profileImageIds,
    );
  }

  private createLecturerProfileUpdateData(
    updatedProfileImageData: ProfileImageData[],
    newProfileImageParams: AwsS3Param[],
  ): LecturerProfileImageUpdateData[] {
    const updateData: LecturerProfileImageUpdateData[] =
      updatedProfileImageData.map((updatedProfileImage) => {
        // 새로운 이미지 추가 원래 있던 이미지 순서가 뒤로
        if (
          updatedProfileImage.profileImageId === '0' &&
          updatedProfileImage.url
        ) {
          return { url: updatedProfileImage.url };
        }
        // 새로운 이미지를 추가하고 해당 순서가 원래 있던 이미지일 때
        if (
          updatedProfileImage.profileImageId === '0' &&
          !updatedProfileImage.url
        ) {
          return this.getNewProfileImage(newProfileImageParams);
        }
        // 원래 위치에 새로운 이미지로 바꿀 때
        if (updatedProfileImage.profileImageId && !updatedProfileImage.url) {
          return this.getUpdatedProfileImage(
            updatedProfileImage.profileImageId,
            newProfileImageParams,
          );
        }
        // 이미지의 순서만 바뀌었을 때
        if (updatedProfileImage.profileImageId && updatedProfileImage.url) {
          return {
            id: parseInt(updatedProfileImage.profileImageId, 10),
            url: updatedProfileImage.url,
          };
        }
      });

    return updateData;
  }

  private getNewProfileImage(newProfileImageParams: AwsS3Param[]) {
    if (newProfileImageParams.length > 0) {
      return { url: newProfileImageParams.shift().url };
    }
    throw new BadRequestException(
      `전달된 이미지 데이터가 올바르지 않습니다.`,
      'invalidImageData',
    );
  }

  private getUpdatedProfileImage(
    profileImageId: string,
    newProfileImageParams: AwsS3Param[],
  ) {
    if (newProfileImageParams.length > 0) {
      const data = {
        id: parseInt(profileImageId, 10),
        url: newProfileImageParams.shift().url,
      };
      return data;
    }
    throw new BadRequestException(
      `전달된 이미지 데이터가 올바르지 않습니다.`,
      'invalidImageData',
    );
  }

  private createNewProfileImageParams(
    lecturerId: number,
    newProfileImages: Express.Multer.File[],
  ): AwsS3Param[] {
    return newProfileImages.map((newProfileImage) => {
      const key = `lecturer/${lecturerId}/${Date.now()}_${
        newProfileImage.originalname
      }`;
      const url = `${this.awsS3.endpoint.href}${this.awsS3BucketName}/${key}`;
      return {
        url,
        Bucket: this.awsS3BucketName,
        Key: key,
        Body: newProfileImage.buffer,
        ACL: 'private',
        ContentType: newProfileImage.mimetype,
      };
    });
  }
}
