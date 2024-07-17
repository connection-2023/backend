import { BadRequestException } from '@nestjs/common';
import { LectureCoupon } from '@prisma/client';

export interface ICoupon {
  validateUsageCount(): void;
  applyDiscount(price: number): number;
  readonly id: number;
  readonly percentage: number;
  readonly discountPrice: number;
  readonly maxDiscountPrice: number;
  readonly title: string;
}

export default class Coupon implements Coupon {
  private _id: number;
  private _lecturerId: number;
  private _title: string;
  private _percentage: number;
  private _discountPrice: number;
  private _maxDiscountPrice: number;
  private _maxUsageCount: number;
  private _usageCount: number;
  private _isDisabled: boolean;
  private _isStackable: boolean;
  private _isPrivate: boolean;
  private _startAt: Date;
  private _endAt: Date;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date;

  constructor(coupon: LectureCoupon) {
    Object.assign(
      this,
      Object.fromEntries(
        Object.entries(coupon).map(([key, value]) => [`_${key}`, value]),
      ),
    );
  }

  validateUsageCount() {
    if (this._maxUsageCount && this._usageCount >= this._maxUsageCount) {
      throw new BadRequestException(
        `쿠폰 사용 제한 횟수를 초과했습니다.`,
        'CouponLimit',
      );
    }
  }

  applyDiscount(price: number): number {
    let discountedPrice = price;

    if (this._percentage > 0) {
      const percentageDiscount = (price * this._percentage) / 100;
      const actualDiscount =
        this._maxDiscountPrice !== null
          ? Math.min(percentageDiscount, this._maxDiscountPrice)
          : percentageDiscount;
      discountedPrice -= actualDiscount;
    }

    if (this._discountPrice > 0) {
      discountedPrice -= this._discountPrice;
    }

    return Math.max(500, discountedPrice);
  }

  get percentage(): number {
    return this._percentage;
  }

  get discountPrice(): number {
    return this._discountPrice;
  }

  get id(): number {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get maxDiscountPrice(): number {
    return this._maxDiscountPrice;
  }
}
