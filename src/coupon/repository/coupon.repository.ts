import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  CouponInputData,
  CouponTargetInputData,
  LectureData,
} from '../interface/interface';
import { LectureCoupon } from '@prisma/client';
import { Id, PrismaTransaction } from '@src/common/interface/common-interface';

@Injectable()
export class CouponRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async trxCreateLectureCoupon(
    transaction: PrismaTransaction,
    couponInputData: CouponInputData,
  ): Promise<LectureCoupon> {
    try {
      return await transaction.lectureCoupon.create({
        data: couponInputData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }

  async getLecturerLecture(
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

  async trxCreateLectureCouponTarget(
    transaction: PrismaTransaction,
    couponInputData: CouponTargetInputData[],
  ) {
    try {
      await transaction.lectureCouponTarget.createMany({
        data: couponInputData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 대상 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }

  async getLectureCoupon(lecturerId: number, couponId: number) {
    try {
      return await this.prismaService.lectureCoupon.findFirst({
        where: { id: couponId, lecturerId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async createCouponTarget(couponTargetInputData: CouponTargetInputData) {
    try {
      await this.prismaService.lectureCouponTarget.createMany({
        data: couponTargetInputData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 대상 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }

  async getCouponTargets(lectureCouponId: number, lectureIds: number[]) {
    try {
      return await this.prismaService.lectureCouponTarget.findMany({
        where: { lectureCouponId, lectureId: { in: lectureIds } },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 대상 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }
}
