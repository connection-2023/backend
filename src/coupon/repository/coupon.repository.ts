import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { CouponInputData, CouponTargetInputData } from '../interface/interface';
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

  // async getUserCouponList(userId: number) {
  //   try {
  //     return await this.prismaService.userCoupon.findMany({
  //       where: { userId },
  //       select: {
  //         isUsed: true,
  //         lectureCoupon: {
  //           select: {
  //             title: true,
  //             isPrivate: true,
  //             maxUsageCount: true,
  //             usageCount: true,
  //             percentage: true,
  //             discountPrice: true,
  //             maxDiscountPrice: true,
  //             startAt: true,
  //             endAt: true,
  //             isDisabled: true,
  //             isStackable: true,
  //             lectureCouponTarget: {
  //               select: {
  //                 lecture: { select: { id: true, title: true } },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       `Prisma 유저 쿠폰 조회 실패: ${error}`,
  //       'PrismaFindFailed',
  //     );
  //   }
  // }

  async getLecturerIssuedCouponList(lecturerId: number) {
    try {
      return await this.prismaService.lectureCoupon.findMany({
        where: { lecturerId },
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
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
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
    endAt?,
    orderBy?,
    cursor?: ICursor,
    skip?: number,
  ) {
    try {
      return await this.prismaService.userCoupon.findMany({
        where: {
          userId,
          lectureCoupon: {
            endAt,
          },
        },
        take,
        skip,
        cursor,
        orderBy,
        select: {
          id: true,
          lectureCouponId: true,
          isUsed: true,
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
        `Prisma 결제 정보 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }
  async countUserCouponCount(userId: number) {
    return await this.prismaService.userCoupon.count({ where: { userId } });
  }
}
