import { Injectable } from '@nestjs/common';
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
    return await transaction.lectureCoupon.create({
      data: couponInputData,
    });
  }

  async getLecturerLecture(lectureData: LectureData[]): Promise<Id[]> {
    return await this.prismaService.lecture.findMany({
      where: { OR: lectureData },
      select: { id: true },
    });
  }

  async trxCreateLectureCouponTarget(
    transaction: PrismaTransaction,
    couponInputData: CouponTargetInputData[],
  ) {
    await transaction.lectureCouponTarget.createMany({ data: couponInputData });
  }
}
