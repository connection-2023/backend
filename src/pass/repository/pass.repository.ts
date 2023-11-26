import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Id, PrismaTransaction } from '@src/common/interface/common-interface';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  LecturePassInputData,
  LecturePassTargetInputData,
} from '@src/pass/interface/interface';
import { LecturePass } from '@prisma/client';

@Injectable()
export class PassRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getLecturerLectures(
    lecturerId: number,
    lectureIds: number[],
  ): Promise<Id[]> {
    try {
      return await this.prismaService.lecture.findMany({
        where: { lecturerId, id: { in: lectureIds } },
        select: { id: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 강의 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async trxCreateLecturePass(
    transaction: PrismaTransaction,
    lecturePassInputData: LecturePassInputData,
  ): Promise<LecturePass> {
    try {
      return await transaction.lecturePass.create({
        data: lecturePassInputData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 패스권 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }

  async trxCreateLecturePassTarget(
    transaction: PrismaTransaction,
    lecturePassTargetInputData: LecturePassTargetInputData[],
  ) {
    try {
      await transaction.lecturePassTarget.createMany({
        data: lecturePassTargetInputData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 대상 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }
}
