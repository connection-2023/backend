import { BadRequestException } from '@nestjs/common';
import { LectureCoupon } from '@prisma/client';
import Coupon, { ICoupon } from '@src/coupon/coupon';
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
  describe('constructor', () => {
    it('일반쿠폰 - 정상적으로 생성되어야 한다.', () => {
      const coupon = generateCoupon({ id: 1, percentage: 10 });

      const paymentCoupons = new PaymentCoupons(coupon, null);

      expect(paymentCoupons.coupon).toBeTruthy();
      expect(paymentCoupons.stackableCoupon).toBeNull();
    });

    it('중복쿠폰 - 정상적으로 생성되어야 한다.', () => {
      const stackableCoupon = generateCoupon({
        id: 2,
        isStackable: true,
        percentage: 10,
      });

      const paymentCoupons = new PaymentCoupons(null, stackableCoupon);

      expect(paymentCoupons.coupon).toBeNull();
      expect(paymentCoupons.stackableCoupon).toBeTruthy();
    });

    it('일반,중복 쿠폰 - 정상적으로 생성되어야 한다.', () => {
      const coupon = generateCoupon({ id: 1, percentage: 10 });
      const stackableCoupon = generateCoupon({
        id: 2,
        isStackable: true,
        discountPrice: 1000,
      });
      const paymentCoupons = new PaymentCoupons(coupon, stackableCoupon);

      expect(paymentCoupons.coupon).toBeTruthy();
      expect(paymentCoupons.stackableCoupon).toBeTruthy();
    });
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

    it('적용된 할인율이 최대 할인 금액보다 높으면 최대 할인 금액이 적용되어야 한다.', () => {
      const coupon = generateCoupon({
        id: 1,
        percentage: 50,
        maxDiscountPrice: 1000,
      });
      const expectedPrice = 9000;

      const paymentCoupons = new PaymentCoupons(coupon, null);

      expect(paymentCoupons.applyDiscount(10000)).toBe(expectedPrice);
    });

    it('할인 금액이 적용되어야 한다.', () => {
      const coupon = generateCoupon({ id: 1, discountPrice: 1000 });
      const expectedPrice = 9000;

      const paymentCoupons = new PaymentCoupons(coupon, null);

      expect(paymentCoupons.applyDiscount(10000)).toBe(expectedPrice);
    });

    it('최종 금액이 최소 금액보다 낮으면 최소 금액이 적용되어야 한다.', () => {
      const coupon = generateCoupon({ id: 1, discountPrice: 1000 });
      const expectedPrice = 500;

      const paymentCoupons = new PaymentCoupons(coupon, null);

      expect(paymentCoupons.applyDiscount(1000)).toBe(expectedPrice);
    });
  });

  describe('getPaymentCouponUsageData', () => {
    const paymentId = 55;
    const createExpectedData = (
      paymentId: number,
      coupon: ICoupon | null = null,
      stackableCoupon: ICoupon | null = null,
    ) => {
      const data: any = {
        paymentId,
      };

      if (coupon) {
        data.couponId = coupon.id;
        data.couponTitle = coupon.title;
        data.couponPercentage = coupon.percentage;
        data.couponDiscountPrice = coupon.discountPrice;
        data.couponMaxDiscountPrice = coupon.maxDiscountPrice;
      }

      if (stackableCoupon) {
        data.stackableCouponId = stackableCoupon.id;
        data.stackableCouponTitle = stackableCoupon.title;
        data.stackableCouponPercentage = stackableCoupon.percentage;
        data.stackableCouponDiscountPrice = stackableCoupon.discountPrice;
        data.stackableCouponMaxDiscountPrice = stackableCoupon.maxDiscountPrice;
      }

      return data;
    };

    it('일반 쿠폰 - 사용 정보를 정상적으로 생성해야 한다.', () => {
      const coupon = generateCoupon({ id: 1, percentage: 10 });
      const stackableCoupon = null;
      const paymentCoupons = new PaymentCoupons(coupon, stackableCoupon);

      const expectedData = createExpectedData(paymentId, coupon);

      expect(paymentCoupons.getPaymentCouponUsageData(paymentId)).toEqual(
        expectedData,
      );
    });

    it('중복 쿠폰 - 사용 정보를 정상적으로 생성해야 한다.', () => {
      const coupon = null;
      const stackableCoupon = generateCoupon({
        id: 2,
        title: '중복쿠폰',
        isStackable: true,
        discountPrice: 1000,
      });
      const paymentCoupons = new PaymentCoupons(coupon, stackableCoupon);

      const expectedData = createExpectedData(
        paymentId,
        coupon,
        stackableCoupon,
      );

      expect(paymentCoupons.getPaymentCouponUsageData(paymentId)).toEqual(
        expectedData,
      );
    });

    it('일반,중복쿠폰 - 사용 정보를 정상적으로 생성해야 한다.', () => {
      const coupon = generateCoupon({ id: 1, percentage: 10 });
      const stackableCoupon = generateCoupon({
        id: 2,
        title: '중복쿠폰',
        isStackable: true,
        discountPrice: 1000,
      });

      const paymentCoupons = new PaymentCoupons(coupon, stackableCoupon);

      const expectedData = createExpectedData(
        paymentId,
        coupon,
        stackableCoupon,
      );

      expect(paymentCoupons.getPaymentCouponUsageData(paymentId)).toEqual(
        expectedData,
      );
    });
  });
});
