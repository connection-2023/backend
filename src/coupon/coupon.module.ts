import { Module } from '@nestjs/common';
import { CouponService } from './services/coupon.service';
import { CouponController } from './controllers/coupon.controller';

@Module({
  providers: [CouponService],
  controllers: [CouponController],
})
export class CouponModule {}
