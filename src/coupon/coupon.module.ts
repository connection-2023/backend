import { Module } from '@nestjs/common';
import { CouponService } from '@src/coupon/services/coupon.service';
import { CouponController } from '@src/coupon/controllers/coupon-lecture.controller';
import { CouponRepository } from '@src/coupon/repository/coupon.repository';

@Module({
  providers: [CouponService, CouponRepository],
  controllers: [CouponController],
})
export class CouponModule {}
