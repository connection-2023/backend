import { BadRequestException } from '@nestjs/common';
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
}
