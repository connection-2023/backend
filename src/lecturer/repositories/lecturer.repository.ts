import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  LecturerRegionInputData,
  LecturerWebsiteInputData,
  LecturerInputData,
  LecturerDanceGenreInputData,
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
}
