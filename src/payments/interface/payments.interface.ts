import {
  PaymentMethods,
  VirtualAccountRefundStatus,
} from '@src/payments/enum/payment.enum';

interface LectureSchedule {
  id?: number;
  lectureScheduleId: number;
  participants: number;
}

interface LectureCoupon {
  lectureCoupon: Coupon;
}

interface Coupon {
  id: number;
  title: string;
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
  statusId: number;
  originalPrice: number;
  finalPrice: number;
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
  originalPrice?: number;
  finalPrice?: number;
}

interface TossPaymentsConfirmResponse {
  card?: TossPaymentCardInfo;
  virtualAccount?: TossPaymentVirtualAccountInfo;
}

interface TossPaymentVirtualAccountInfo {
  accountNumber: string;
  accountType: string;
  bankCode: string;
  customerName: string;
  dueDate: string;
  expired: boolean;
  settlementStatus: string;
  refundStatus: string;
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

interface IPaymentResult {
  orderId: string;
  orderName: string;
  originalPrice: number;
  finalPrice: number;
  createdAt: Date;
  updatedAt: Date;

  paymentProductType: {
    name: string;
  };
  paymentMethod: {
    name: string;
  };
  cardPaymentInfo: ICardPaymentInfo | null;
  virtualAccountPaymentInfo: IVirtualAccountPaymentInfo | null;
  reservation: IReservationInfo[];
  userPass: IUserPass[];
}

interface ICardPaymentInfo {
  number: string;
  installmentPlanMonths: number;
  approveNo: string;
}

interface IVirtualAccountPaymentInfo {
  accountNumber: string;
  customerName: string;
  dueDate: Date;
  bank: {
    code: string;
    name: string;
  };
}

interface VirtualAccountPaymentInfoInputData {
  paymentId: number;
  refundStatusId: number;
  accountNumber: string;
  bankCode: string;
  customerName: string;
  dueDate: Date;
  expired: boolean;
}

interface IReservationInfo {
  lectureSchedule: ILectureSchedule;
  participants: number;
  requests: string | null;
}

interface IUserPass {
  lecturePass: ILecturePass;
}

interface ILecturePass {
  id: number;
  availableMonths: number;
}

interface ILectureSchedule {
  lectureId: number;
  startDateTime: Date;
}

interface ICursor {
  id: number;
}

interface UserPassInputData {
  userId: number;
  paymentId: number;
  lecturePassId: number;
  remainingUses: number;
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
  TossPaymentVirtualAccountInfo,
  CardInfo,
  CardPaymentInfoInputData,
  VirtualAccountPaymentInfoInputData,
  IPaymentResult,
  ICursor,
  UserPassInputData,
};
