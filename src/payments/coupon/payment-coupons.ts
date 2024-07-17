import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ICoupon } from '@src/coupon/coupon';

export default class PaymentCoupons {
  private readonly _coupon: ICoupon | null;
  private readonly _stackableCoupon: ICoupon | null;

  constructor(coupon: ICoupon | null, stackableCoupon: ICoupon | null) {
    this._coupon = coupon;
    this._stackableCoupon = stackableCoupon;

    this.validateCoupons();
    this.validateNoDuplicatePercentage();
  }

  private validateCoupons() {
    if (this._coupon) {
      this._coupon.validateUsageCount();
    }
    if (this._stackableCoupon) {
      this._stackableCoupon.validateUsageCount();
    }
  }

  private validateNoDuplicatePercentage() {
    if (
      this._coupon &&
      this._stackableCoupon &&
      this._coupon.percentage > 0 &&
      this._stackableCoupon.percentage > 0
    ) {
      throw new BadRequestException(
        `할인율은 중복적용이 불가능합니다.`,
        'DuplicatePercentageDiscount',
      );
    }
  }

  applyDiscount(initialPrice: number): number {
    const firstCoupon =
      this._coupon?.percentage > 0 ? this._coupon : this._stackableCoupon;
    const secondCoupon =
      firstCoupon === this._coupon ? this._stackableCoupon : this._coupon;

    let price = initialPrice;
    if (firstCoupon) {
      price = firstCoupon.applyDiscount(price);
    }
    if (secondCoupon) {
      price = secondCoupon.applyDiscount(price);
    }

    return price;
  }

  compareCouponAppliedPrice(initialPrice: number, clientPrice: number) {
    const finalPrice = this.applyDiscount(initialPrice);

    if (finalPrice !== clientPrice) {
      throw new BadRequestException(
        `결제 금액이 일치하지 않습니다.`,
        'PaymentAmountMismatch',
      );
    }
  }

  getPaymentCouponUsageData(
    paymentId: number,
  ): Prisma.PaymentCouponUsageUncheckedCreateInput {
    const data: Prisma.PaymentCouponUsageUncheckedCreateInput = {
      paymentId,
    };

    const addCouponData = (coupon: ICoupon | null, prefix: string = '') => {
      if (coupon) {
        data[`${prefix}Id`] = coupon.id;
        data[`${prefix}Title`] = coupon.title;
        data[`${prefix}Percentage`] = coupon.percentage;
        data[`${prefix}DiscountPrice`] = coupon.discountPrice;
        data[`${prefix}MaxDiscountPrice`] = coupon.maxDiscountPrice;
      }
    };

    addCouponData(this._coupon, 'coupon');
    addCouponData(this._stackableCoupon, 'stackableCoupon');

    return data;
  }

  get couponIds(): number[] {
    return [this._coupon?.id, this._stackableCoupon?.id].filter(
      (id) => id !== undefined,
    );
  }

  get coupon(): ICoupon | null {
    return this._coupon;
  }

  get stackableCoupon(): ICoupon | null {
    return this._stackableCoupon;
  }
}
