import { PaymentMethods } from '@src/payments/enum/payment.enum';

interface LectureSchedule {
  lectureScheduleId: number;
  participants: number;
}

interface LectureCoupon {
  lectureCoupon: Coupon;
}

interface Coupon {
  id: number;
  percentage: number | null;
  discountPrice: number | null;
  maxDiscountPrice: number | null;
}

interface Coupons {
  coupon?: Coupon;
  stackableCoupon?: Coupon;
}

interface LecturePaymentInputData {
  userId: number;
  orderId: string;
  orderName: string;
  paymentMethodId: number;
  statusId: number;
  price: number;
}

interface ReservationInputData {
  userId: number;
  lecturePaymentId: number;
  lectureScheduleId: number;
  representative: string;
  phoneNumber: string;
  participants: number;
  requests?: string | null;
}

interface LecturePaymentInfo {
  orderId: string;
  orderName: string;
  value: number;
  method: PaymentMethods;
}
interface LectureCouponUseage {
  lectureCoupon: {
    maxUsageCount: number;
    usageCount: number;
  };
}

export {
  LectureSchedule,
  LectureCoupon,
  Coupon,
  Coupons,
  LecturePaymentInputData,
  ReservationInputData,
  LecturePaymentInfo,
  LectureCouponUseage,
};
