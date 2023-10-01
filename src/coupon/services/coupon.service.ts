import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateLectureCouponDto } from '../dtos/create-lecture-coupon.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '@src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { LectureCoupon, Lecturer } from '@prisma/client';
import { CouponInputData } from '../interface/interface';

@Injectable()
export class CouponService {
  private readonly logger = new Logger(CouponService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async createLectureCoupon(
    lecturerId: number,
    createLectureCouponDto: CreateLectureCouponDto,
  ) {
    const couponInputData: CouponInputData = {
      lecturerId,
      ...createLectureCouponDto,
      deletedAt: '212121',
    };
    const createResult: LectureCoupon =
      await this.prismaService.lectureCoupon.create({
        data: couponInputData,
      });
  }
}
