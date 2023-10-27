import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  LecturerRegionInputData,
  LecturerDanceGenreInputData,
  LecturerProfileImageInputData,
  LecturerCoupon,
  LecturerProfile,
  LecturerInputData,
  LecturerUpdateData,
  LecturerInstagramPostInputData,
  LecturerProfileCard,
} from '@src/lecturer/interface/lecturer.interface';
import {
  Id,
  PrismaTransaction,
  Region,
} from '@src/common/interface/common-interface';
import { Lecturer } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';

@Injectable()
export class LecturerRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async trxCreateLecturer(
    transaction: PrismaTransaction,
    lecturerCreateInput: LecturerInputData,
  ): Promise<Lecturer> {
    return await transaction.lecturer.create({
      data: lecturerCreateInput,
    });
  }

  async getLecturerByUserId(userId: number): Promise<Lecturer> {
    return await this.prismaService.lecturer.findUnique({ where: { userId } });
  }

  async trxCreateLecturerRegions(
    transaction: PrismaTransaction,
    lecturerInputData: LecturerRegionInputData[],
  ): Promise<void> {
    await transaction.lecturerRegion.createMany({ data: lecturerInputData });
  }

  async trxCreateLecturerInstagramPost(
    transaction: PrismaTransaction,
    lecturerInstagramPostInputData: LecturerInstagramPostInputData[],
  ): Promise<void> {
    try {
      await transaction.lecturerInstagramPostUrl.createMany({
        data: lecturerInstagramPostInputData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `강사 웹사이트 생성 실패: ${error}`,
        'LecturerInstagramPostUrlsCreateFailed',
      );
    }
  }

  async trxCreateLecturerDanceGenres(
    transaction: PrismaTransaction,
    lecturerDanceGenresInputData: LecturerDanceGenreInputData[],
  ): Promise<void> {
    await transaction.lecturerDanceGenre.createMany({
      data: lecturerDanceGenresInputData,
    });
  }

  async getRegionsId(regions: Region[]): Promise<Id[]> {
    const regionsId: Id[] = await this.prismaService.region.findMany({
      where: { OR: regions },
      select: { id: true },
    });
    return regionsId;
  }

  async getLecturerNickname(nickname: string): Promise<{ nickname: string }> {
    return await this.prismaService.lecturer.findUnique({
      where: { nickname },
      select: { nickname: true },
    });
  }

  async trxCreateLecturerProfileImages(
    transaction: PrismaTransaction,
    lecturerProfileImageInputData: LecturerProfileImageInputData[],
  ): Promise<void> {
    try {
      await transaction.lecturerProfileImageUrl.createMany({
        data: lecturerProfileImageInputData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `강사 프로필 이미지 생성 실패: ${error}`,
        'LecturerProfileImageUpdateFailed',
      );
    }
  }

  async getLecturerCouponsByLecturerId(
    lecturerId: number,
  ): Promise<LecturerCoupon[]> {
    return await this.prismaService.lectureCoupon.findMany({
      where: { lecturerId, isDisabled: false },
      select: {
        id: true,
        title: true,
        percentage: true,
        discountPrice: true,
        isStackable: true,
        maxDiscountPrice: true,
        startAt: true,
        endAt: true,
      },
    });
  }

  async updateLecturerNickname(lectureId, nickname) {
    await this.prismaService.lecturer.update({
      where: { id: lectureId },
      data: { nickname },
    });
  }

  async getLecturerProfile(lecturerId: number): Promise<LecturerProfile> {
    return await this.prismaService.lecturer.findFirst({
      where: { id: lecturerId, deletedAt: null },
      select: {
        profileCardImageUrl: true,
        nickname: true,
        email: true,
        phoneNumber: true,
        youtubeUrl: true,
        instagramUrl: true,
        homepageUrl: true,
        affiliation: true,
        introduction: true,
        experience: true,
        lecturerRegion: {
          select: {
            region: {
              select: { administrativeDistrict: true, district: true },
            },
          },
        },
        lecturerDanceGenre: {
          select: {
            name: true,
            danceCategory: { select: { genre: true } },
          },
        },
        lecturerInstagramPostUrl: {
          select: { url: true },
          orderBy: { id: 'asc' },
        },
        lecturerProfileImageUrl: {
          select: { url: true },
          orderBy: { id: 'asc' },
        },
      },
    });
  }

  async getLecturerProfileCard(lecturerId): Promise<LecturerProfileCard> {
    return await this.prismaService.lecturer.findFirst({
      where: { id: lecturerId, deletedAt: null },
      select: {
        id: true,
        profileCardImageUrl: true,
        nickname: true,
      },
    });
  }

  async trxDeleteLecturerProfileImages(
    transaction: PrismaTransaction,
    lecturerId: number,
  ): Promise<void> {
    try {
      await transaction.lecturerProfileImageUrl.deleteMany({
        where: { lecturerId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `강사 프로필 이미지 삭제 실패: ${error}`,
        'LecturerProfileImageDeleteFailed',
      );
    }
  }

  async trxDeleteLecturerDanceGenres(
    transaction: PrismaTransaction,
    lecturerId: number,
  ): Promise<void> {
    try {
      await transaction.lecturerDanceGenre.deleteMany({
        where: { lecturerId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `강사 장르 삭제 실패: ${error}`,
        'LecturerDanceGenresDeleteFailed',
      );
    }
  }

  async trxDeleteLecturerRegions(
    transaction: PrismaTransaction,
    lecturerId: number,
  ) {
    try {
      await transaction.lecturerRegion.deleteMany({
        where: { lecturerId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `강사 지역 삭제 실패: ${error}`,
        'LecturerRegionsDeleteFailed',
      );
    }
  }

  async trxDeleteLecturerInstagramPostUrls(
    transaction: PrismaTransaction,
    lecturerId: number,
  ) {
    try {
      await transaction.lecturerInstagramPostUrl.deleteMany({
        where: { lecturerId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `강사 인스타 포스트 삭제 실패: ${error}`,
        'LecturerInstagramUrlsDeleteFailed',
      );
    }
  }

  async trxUpdateLecturer(
    transaction: PrismaTransaction,
    lecturerId: number,
    lecturerUpdateData: LecturerUpdateData,
  ) {
    try {
      await transaction.lecturer.update({
        where: { id: lecturerId },
        data: lecturerUpdateData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `강사정보 업데이트 실패: ${error}`,
        'LecturerUpdateFailed',
      );
    }
  }
}
