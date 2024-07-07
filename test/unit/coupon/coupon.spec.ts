import { LectureCoupon } from '@prisma/client';
import Coupon from '@src/coupon/coupon';

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

describe('Coupon', () => {
  it('정상적으로 생성되어야 한다.', () => {
    const coupon = generateCoupon();

    expect(coupon).toBeDefined();
  });

  describe('validateUsageCount', () => {
    it('사용횟수가 초과되지 않았다면 오류가 발생하지 않아야 한다.', () => {
      const coupon = generateCoupon({ usageCount: 0, maxUsageCount: 10 });
      expect(() => coupon.validateUsageCount()).not.toThrow();
    });

    it('사용횟수가 초과되었다면 오류가 발생해야 한다.', () => {
      const coupon = generateCoupon({ usageCount: 10, maxUsageCount: 10 });
      expect(() => coupon.validateUsageCount()).toThrow();
    });
  });

  describe('applyDiscount', () => {
    it('할인율이 적용되어야한다.', () => {
      const price = 10000;
      const coupon = generateCoupon({ id: 1, percentage: 30 });
      const expectedPrice = 7000;

      expect(coupon.applyDiscount(price)).toBe(expectedPrice);
    });

    it('할인율이 maxDiscountPrice를 초과하면 maxDiscountPrice 가 적용되어야한다.', () => {
      const price = 10000;
      const coupon = generateCoupon({
        id: 1,
        percentage: 50,
        maxDiscountPrice: 1000,
      });
      const expectedPrice = 9000;

      expect(coupon.applyDiscount(price)).toBe(expectedPrice);
    });

    it('할인금액이 적용되어야 한다.', () => {
      const price = 10000;
      const coupon = generateCoupon({ id: 1, discountPrice: 1000 });
      const expectedPrice = 9000;

      expect(coupon.applyDiscount(price)).toBe(expectedPrice);
    });

    it('할인된 금액이 지정된 최소금액보다 낮으면 최소금액이 적용되어야 한다.', () => {
      const price = 10000;
      const coupon = generateCoupon({ id: 1, discountPrice: 10000 });
      const expectedPrice = 500;

      expect(coupon.applyDiscount(price)).toBe(expectedPrice);
    });
  });
});
