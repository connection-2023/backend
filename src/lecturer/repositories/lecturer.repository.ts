import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  LecturerRegionInputData,
  LecturerWebsiteInputData,
  LecturerInputData,
  LecturerDanceGenreInputData,
  LecturerProfileImageInputData,
  LecturerCoupon,
  LecturerProfile,
  LecturerProfileImageUpdateData,
} from '@src/lecturer/interface/lecturer.interface';
import {
  Id,
  PrismaTransaction,
  Region,
} from '@src/common/interface/common-interface';
import { Lecturer } from '@prisma/client';

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

  async trxCreateLecturerWebsiteUrls(
    transaction: PrismaTransaction,
    lecturerWebsiteInputData: LecturerWebsiteInputData[],
  ): Promise<void> {
    await transaction.lecturerWebsiteUrl.createMany({
      data: lecturerWebsiteInputData,
    });
  }

  async trxCreateLecturerDanceGenres(
    transaction: PrismaTransaction,
    lecturerWebsiteInputData: LecturerDanceGenreInputData[],
  ): Promise<void> {
    await transaction.lecturerDanceGenre.createMany({
      data: lecturerWebsiteInputData,
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
    await transaction.lecturerProfileImageUrl.createMany({
      data: lecturerProfileImageInputData,
    });
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

  async getLecturerProfile(lectureId: number): Promise<LecturerProfile> {
    return await this.prismaService.lecturer.findUnique({
      where: { id: lectureId },
      select: {
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
        lecturerWebsiteUrl: true,
        lecturerProfileImageUrl: {
          orderBy: { id: 'asc' },
        },
      },
    });
  }
  async deleteLecturerProfileImages(
    lecturerId: number,
    profileImageIds: number[],
  ): Promise<void> {
    await this.prismaService.lecturerProfileImageUrl.deleteMany({
      where: { id: { in: profileImageIds }, lecturerId },
    });
  }

  async updateLecturerProfileImages(
    lecturerId: number,
    lecturerProfileUpdateData: LecturerProfileImageUpdateData[],
  ) {
    await Promise.all(
      lecturerProfileUpdateData.map(async (data) => {
        await this.prismaService.lecturerProfileImageUrl.upsert({
          where: { id: data.id },
          update: { url: data.url },
          create: { lecturerId, url: data.url },
        });
      }),
    );
  }
}
