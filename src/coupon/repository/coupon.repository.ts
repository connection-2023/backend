import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  CouponInputData,
  CouponTargetInputData,
  CouponUpdateData,
} from '../interface/interface';
import { LectureCoupon, UserCoupon } from '@prisma/client';
import {
  ICursor,
  Id,
  PrismaTransaction,
} from '@src/common/interface/common-interface';

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

  async trxCreateLectureCouponTarget(
    transaction: PrismaTransaction,
    couponTargetInputData: CouponTargetInputData[],
  ) {
    try {
      return await transaction.lectureCouponTarget.createMany({
        data: couponTargetInputData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 대상 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }

  async getLectureCouponByLecturerId(lecturerId: number, couponId: number) {
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

  async getLectureCoupon(couponId: number) {
    try {
      return await this.prismaService.lectureCoupon.findFirst({
        where: { id: couponId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async getUserCoupon(
    userId: number,
    lectureCouponId: number,
  ): Promise<UserCoupon> {
    try {
      return await this.prismaService.userCoupon.findUnique({
        where: {
          userId_lectureCouponId: { userId, lectureCouponId },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 유저 쿠폰 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async createUserCoupon(
    userId: number,
    lectureCouponId: number,
  ): Promise<void> {
    try {
      await this.prismaService.userCoupon.create({
        data: { userId, lectureCouponId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 유저 쿠폰 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }

  async getLecturerCoupon(lecturerId, couponId): Promise<LectureCoupon> {
    try {
      return await this.prismaService.lectureCoupon.findFirst({
        where: { id: couponId, lecturerId, deletedAt: null },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async getApplicableCouponsForLecture(lectureId: number) {
    try {
      return await this.prismaService.lectureCouponTarget.findMany({
        where: {
          lectureId,
          lectureCoupon: { isPrivate: false, isDisabled: false },
        },
        select: {
          lectureCoupon: {
            select: {
              id: true,
              title: true,
              maxUsageCount: true,
              usageCount: true,
              percentage: true,
              discountPrice: true,
              maxDiscountPrice: true,
              isStackable: true,
              startAt: true,
              endAt: true,
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async getUserCouponList(
    userId: number,
    take: number,
    endAt,
    orderBy,
    isUsed: boolean | undefined,
    lectureCouponTarget,
    cursor?: ICursor,
    skip?: number,
  ) {
    try {
      return await this.prismaService.userCoupon.findMany({
        where: {
          userId,
          lectureCoupon: {
            endAt,
            lectureCouponTarget,
          },
          isUsed,
        },
        take,
        skip,
        cursor,
        orderBy,
        select: {
          id: true,
          lectureCouponId: true,
          isUsed: true,
          updatedAt: true,
          lectureCoupon: {
            select: {
              title: true,
              isPrivate: true,
              maxUsageCount: true,
              usageCount: true,
              percentage: true,
              discountPrice: true,
              maxDiscountPrice: true,
              startAt: true,
              endAt: true,
              isDisabled: true,
              isStackable: true,
              lectureCouponTarget: {
                select: {
                  lecture: { select: { id: true, title: true } },
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 정보 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async countUserCoupons(
    userId: number,
    isUsed: boolean | undefined,
    endAt,
    lectureCouponTarget,
  ): Promise<number> {
    try {
      return await this.prismaService.userCoupon.count({
        where: {
          userId,
          lectureCoupon: {
            endAt,
            lectureCouponTarget,
          },
          isUsed,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async getLecturerIssuedCouponList(
    lecturerId: number,
    OR: Array<object>,
    orderBy: Array<object> | object,
    endAt: object,
    lectureCouponTarget: object,
    take: number,
    cursor?: ICursor,
    skip?: number,
  ) {
    try {
      return await this.prismaService.lectureCoupon.findMany({
        where: {
          lecturerId,
          endAt,
          lectureCouponTarget,
          OR,
        },
        take,
        orderBy,
        cursor,
        skip,
        select: {
          id: true,
          title: true,
          isPrivate: true,
          maxUsageCount: true,
          usageCount: true,
          percentage: true,
          discountPrice: true,
          maxDiscountPrice: true,
          startAt: true,
          endAt: true,
          isDisabled: true,
          isStackable: true,
          createdAt: true,
          updatedAt: true,
          lectureCouponTarget: {
            select: {
              lecture: { select: { id: true, title: true } },
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async countIssuedCoupons(
    lecturerId: number,
    endAt: object,
    lectureCouponTarget: object,
    OR: Array<object>,
  ): Promise<number> {
    try {
      return await this.prismaService.lectureCoupon.count({
        where: { lecturerId, endAt, lectureCouponTarget, OR },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }
  async trxUpdateLectureCoupon(
    transaction: PrismaTransaction,
    couponId: number,
    couponUpdateData: CouponUpdateData,
  ) {
    try {
      return await transaction.lectureCoupon.update({
        where: { id: couponId },
        data: couponUpdateData,
        include: {
          lectureCouponTarget: { include: { lecture: true } },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 수정 실패: ${error}`,
        'PrismaUpdateFailed',
      );
    }
  }

  async trxDeleteLectureCouponTarget(
    transaction: PrismaTransaction,
    couponId: number,
  ) {
    try {
      await transaction.lectureCouponTarget.deleteMany({
        where: { lectureCouponId: couponId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 삭제 실패: ${error}`,
        'PrismaDeleteFailed',
      );
    }
  }

  async softDeleteLectureCoupon(couponId: number): Promise<void> {
    try {
      const currentDate = new Date();

      await this.prismaService.lectureCoupon.update({
        where: { id: couponId },
        data: { deletedAt: currentDate },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 수정 실패: ${error}`,
        'PrismaUpdateFailed',
      );
    }
  }

  async deleteUserCoupon(userId: number, couponId: number): Promise<void> {
    try {
      await this.prismaService.userCoupon.deleteMany({
        where: { userId, lectureCouponId: couponId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 쿠폰 삭제 실패: ${error}`,
        'PrismaDeleteFailed',
      );
    }
  }
}
