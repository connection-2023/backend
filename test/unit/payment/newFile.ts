import PaymentCoupons from '@src/payments/coupon/payment-coupons';
import { generateCoupon } from './payment-coupons.spec';

describe('PaymentCoupons', () => {
  it('정상적으로 생성되어야 한다.', () => {
    const coupon = generateCoupon({ id: 1, percentage: 10 });
    const stackableCoupon = generateCoupon({
      id: 2,
      isStackable: true,
      discountPrice: 1000,
    });

    expect(new PaymentCoupons(coupon, stackableCoupon)).toBeDefined();
  });

  it('할인 방식이 모두 퍼센트인 경우 오류가 발생해야 한다.', () => {
    const coupon = generateCoupon({ id: 1, percentage: 10 });
    const stackableCoupon = generateCoupon({
      id: 2,
      isStackable: true,
      percentage: 10,
    });

    expect(() => new PaymentCoupons(coupon, stackableCoupon)).toThrow(
      BadRequestException(
        `할인율은 중복적용이 불가능합니다.`,
        'DuplicateDiscount',
      ),
    );
  });
});
