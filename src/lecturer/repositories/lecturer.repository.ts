import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateLecturerDto } from '../dtos/create-lecturer.dto';
import {
  LecturerRegionInputData,
  LecturerWebsiteInputData,
  LecturerInputData,
  LecturerDanceGenreInputData,
} from '../interface/lecturer.interface';
import { PrismaTransaction } from '@src/common/interface/common-interface';
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
}
