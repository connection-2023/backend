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

interface PaymentInputData {
  lecturerId?: number;
  userId?: number;
  orderId: string;
  orderName: string;
  paymentMethodId: number;
  statusId: number;
  price: number;
  paymentProductTypeId: number;
}

interface ReservationInputData {
  userId: number;
  paymentId: number;
  lectureScheduleId: number;
  representative: string;
  phoneNumber: string;
  participants: number;
  requests?: string | null;
}

interface LectureCouponUseage {
  lectureCoupon: {
    maxUsageCount: number;
    usageCount: number;
  };
}

interface PaymentInfo {
  orderId?: string;
  amount?: number;
  paymentKey?: string;
  orderName?: string;
  method?: PaymentMethods;
  value?: number;
  price?: number;
}

interface TossPaymentsConfirmResponse {
  card?: TossPaymentCardInfo;
  virtualAccount?: VirtualAccountInfo;
}

interface VirtualAccountInfo {
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

interface CardInfo {
  issuerCode: string;
  acquirerCode?: string | null;
  number: string;
  installmentPlanMonths: number;
  approveNo: string;
  cardType: string;
  ownerType: string;
  isInterestFree: boolean;
}

interface TossPaymentCardInfo extends CardInfo {
  amount: number;
  interestPayer: null;
  useCardPoint: boolean;
  acquireStatus: string;
}

interface CardPaymentInfoInputData extends CardInfo {
  paymentId: number;
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
  PaymentInputData,
  ReservationInputData,
  LectureCouponUseage,
  PaymentInfo,
  LecturePaymentUpdateData,
  TossPaymentsConfirmResponse,
  TossPaymentCardInfo,
  VirtualAccountInfo,
  CardInfo,
  CardPaymentInfoInputData,
};
