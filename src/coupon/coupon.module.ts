import { Module } from '@nestjs/common';
import { CouponService } from '@src/coupon/services/coupon.service';
import { CouponRepository } from '@src/coupon/repository/coupon.repository';
import { CouponController } from './controllers/coupon.controller';

@Module({
  providers: [CouponService, CouponRepository],
  controllers: [CouponController],
})
export class CouponModule {}
