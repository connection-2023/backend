import { ApiProperty } from '@nestjs/swagger';
import { PaymentCouponUsage } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PaymentCouponUsageDto implements PaymentCouponUsage {
  id: number;
  paymentId: number;

  @ApiProperty({
    type: Number,
    description: '일반 쿠폰 Id',
    nullable: true,
  })
  @Expose()
  couponId: number;

  @ApiProperty({
    description: '일반 쿠폰명',
    nullable: true,
  })
  @Expose()
  couponTitle: string;

  @ApiProperty({
    type: Number,
    description: '일반 쿠폰 할인률',
    nullable: true,
  })
  @Expose()
  couponPercentage: number;

  @ApiProperty({
    type: Number,
    description: '일반 쿠폰 할인 금액',
    nullable: true,
  })
  @Expose()
  couponDiscountPrice: number;

  @ApiProperty({
    type: Number,
    description: '일반 쿠폰 최대 할인 금액',
    nullable: true,
  })
  @Expose()
  couponMaxDiscountPrice: number;

  @ApiProperty({
    type: Number,
    description: '중복 쿠폰 Id',
    nullable: true,
  })
  @Expose()
  stackableCouponId: number;

  @ApiProperty({
    description: '중복 쿠폰명',
  })
  @Expose()
  stackableCouponTitle: string;

  @ApiProperty({
    type: Number,
    description: '중복 쿠폰 할인률',
    nullable: true,
  })
  @Expose()
  stackableCouponPercentage: number;

  @ApiProperty({
    type: Number,
    description: '중복 쿠폰 할인 금액',
    nullable: true,
  })
  @Expose()
  stackableCouponDiscountPrice: number;

  @ApiProperty({
    type: Number,
    description: '중복 쿠폰 최대 할인 금액',
    nullable: true,
  })
  @Expose()
  stackableCouponMaxDiscountPrice: number;

  constructor(paymentCouponUsage: Partial<PaymentCouponUsageDto>) {
    Object.assign(this, paymentCouponUsage);
  }
}
