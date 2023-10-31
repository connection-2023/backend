import { PaymentMethods, RefundStatus } from '@src/payments/enum/payment.enum';

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

interface PaymentInfo {
  orderId: string;
  amount: number;
  paymentKey?: string;
}

interface TossPaymentsConfirmResponse {
  card?: Card;
  virtualAccount?: VirtualAccount;
}
interface VirtualAccount {
  accountNumber: string;
  accountType: string;
  bankCode: number;
  customerName: string;
  dueDate: Date;
  expired: boolean;
  settlementStatus: string;
  refundStatus: RefundStatus;
  refundReceiveAccount: object | null;
}
interface Card {
  amount: number;
  issuerCode: string;
  acquirerCode: string | null;
  number: string;
  installmentPlanMonths: number;
  isInterestFree: false;
  interestPayer: null;
  approveNo: string;
  useCardPoint: boolean;
  cardType: string;
  ownerType: string;
  acquireStatus: string;
}

interface LecturePaymentUpdateData {
  paymentKey: string;
  statusId: number;
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
  PaymentInfo,
  LecturePaymentUpdateData,
  TossPaymentsConfirmResponse,
};
