import { ApiProperty } from '@nestjs/swagger';
import { PaymentCouponUsage } from '@prisma/client';

export class PaymentCouponUsageDto implements PaymentCouponUsage {
  id: number;
  paymentId: number;

  @ApiProperty({
    type: Number,
    description: '일반 쿠폰 Id',
    nullable: true,
  })
  couponId: number;

  @ApiProperty({
    description: '일반 쿠폰명',
    nullable: true,
  })
  couponTitle: string;

  @ApiProperty({
    type: Number,
    description: '일반 쿠폰 할인률',
    nullable: true,
  })
  couponPercentage: number;

  @ApiProperty({
    type: Number,
    description: '일반 쿠폰 할인 금액',
    nullable: true,
  })
  couponDiscountPrice: number;

  @ApiProperty({
    type: Number,
    description: '일반 쿠폰 최대 할인 금액',
    nullable: true,
  })
  couponMaxDiscountPrice: number;

  @ApiProperty({
    type: Number,
    description: '중복 쿠폰 Id',
    nullable: true,
  })
  stackableCouponId: number;

  @ApiProperty({
    description: '중복 쿠폰명',
  })
  stackableCouponTitle: string;

  @ApiProperty({
    type: Number,
    description: '중복 쿠폰 할인률',
    nullable: true,
  })
  stackableCouponPercentage: number;

  @ApiProperty({
    type: Number,
    description: '중복 쿠폰 할인 금액',
    nullable: true,
  })
  stackableCouponDiscountPrice: number;

  @ApiProperty({
    type: Number,
    description: '중복 쿠폰 최대 할인 금액',
    nullable: true,
  })
  stackableCouponMaxDiscountPrice: number;

  constructor(paymentCouponUsage: Partial<PaymentCouponUsageDto>) {
    this.couponId = paymentCouponUsage.couponId;
    this.couponTitle = paymentCouponUsage.couponTitle;
    this.couponPercentage = paymentCouponUsage.couponPercentage;
    this.couponDiscountPrice = paymentCouponUsage.couponDiscountPrice;
    this.couponMaxDiscountPrice = paymentCouponUsage.couponMaxDiscountPrice;
    this.stackableCouponId = paymentCouponUsage.stackableCouponId;
    this.stackableCouponTitle = paymentCouponUsage.stackableCouponTitle;
    this.stackableCouponPercentage =
      paymentCouponUsage.stackableCouponPercentage;
    this.stackableCouponDiscountPrice =
      paymentCouponUsage.stackableCouponDiscountPrice;
    this.stackableCouponMaxDiscountPrice =
      paymentCouponUsage.stackableCouponMaxDiscountPrice;

    Object.assign(this);
  }
}
