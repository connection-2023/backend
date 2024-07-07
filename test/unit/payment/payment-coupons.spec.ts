import { BadRequestException } from '@nestjs/common';
import { LectureCoupon } from '@prisma/client';
import Coupon from '@src/coupon/coupon';
import PaymentCoupons from '@src/payments/coupon/payment-coupons';

const generateCoupon = (override?: Partial<LectureCoupon>) => {
  return new Coupon({
    id: 1,
    lecturerId: 1,
    title: '일반 쿠폰',
    percentage: null,
    discountPrice: null,
    maxDiscountPrice: null,
    maxUsageCount: null,
    usageCount: 0,
    isDisabled: false,
    isStackable: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    isPrivate: false,
    startAt: new Date(),
    endAt: new Date(),
    ...override,
  });
};

describe('PaymentCoupons', () => {
  it('정상적으로 생성되어야 한다.', () => {
    const coupon = generateCoupon({ id: 1, percentage: 10 });
    const stackableCoupon = null;
    expect(new PaymentCoupons(coupon, stackableCoupon)).toBeDefined();
  });

  it('할인율은 중복 적용이 불가능해야 한다.', () => {
    const coupon = generateCoupon({ id: 1, percentage: 10 });
    const stackableCoupon = generateCoupon({
      id: 2,
      isStackable: true,
      percentage: 10,
    });

    expect(() => new PaymentCoupons(coupon, stackableCoupon)).toThrow(
      new BadRequestException(
        `할인율은 중복적용이 불가능합니다.`,
        'DuplicateDiscount',
      ),
    );
  });

  describe('applyDiscount', () => {
    it('할인율이 적용되어야 한다.', () => {
      const coupon = generateCoupon({ id: 1, percentage: 10 });
      const stackableCoupon = null;
      const paymentCoupons = new PaymentCoupons(coupon, stackableCoupon);

      expect(paymentCoupons.applyDiscount(1000)).toBe(900);
    });
  });
});
