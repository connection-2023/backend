import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ICursor,
  Id,
  PrismaTransaction,
} from '@src/common/interface/common-interface';
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
        `Prisma 패스권 대상 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }
  async countIssuedPasses(lecturerId: number) {
    try {
      return await this.prismaService.lecturePass.count({
        where: { lecturerId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async getIssuedLecturePasses(
    lecturerId: number,
    take: number,
    isDisabled: boolean,
    orderBy: object,
    lecturePassTarget: object,
    cursor: ICursor,
    skip: number,
  ) {
    try {
      return await this.prismaService.lecturePass.findMany({
        where: {
          lecturerId,
          isDisabled,
          lecturePassTarget,
        },
        take,
        orderBy,
        cursor,
        skip,
        select: {
          id: true,
          title: true,
          price: true,
          availableMonths: true,
          maxUsageCount: true,
          salesCount: true,
          lecturePassTarget: {
            select: {
              lecture: { select: { id: true, title: true } },
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 패스권 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async getLecturePassList(lectureId): Promise<LecturePass[]> {
    try {
      return await this.prismaService.lecturePass.findMany({
        where: { lecturePassTarget: { some: { lectureId } } },
        include: { lecturePassTarget: { include: { lecture: true } } },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 패스권 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async getLecturerPassList(lecturerId): Promise<LecturePass[]> {
    try {
      return await this.prismaService.lecturePass.findMany({
        where: { lecturerId },
        include: { lecturePassTarget: { include: { lecture: true } } },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 패스권 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async getPassByIdAndLecturerId(lecturerId: number, passId: number) {
    return await this.prismaService.lecturePass.findFirst({
      where: { id: passId, lecturerId },
      include: { lecturePassTarget: { include: { lecture: true } } },
    });
  }

  async getPassWithLecturerById(passId: number) {
    return await this.prismaService.lecturePass.findFirst({
      where: { id: passId },
      include: {
        lecturePassTarget: { include: { lecture: true } },
        lecturer: true,
      },
    });
  }
}
