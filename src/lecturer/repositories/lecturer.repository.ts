import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateLecturerDto } from '../dtos/create-lecturer.dto';
import {
  LecturerCreateInput,
  LecturerInputData,
} from '../interface/lecturer.interface';
import { Id, PrismaTransaction } from '@src/common/interface/common-interface';
import { Lecturer } from '@prisma/client';

@Injectable()
export class LecturerRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async trxCreateLecturer(
    transaction: PrismaTransaction,
    lecturerCreateInput: LecturerCreateInput,
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
    lecturerInputData: LecturerInputData[],
  ) {
    await transaction.lecturerRegion.createMany({ data: lecturerInputData });
  }
}
