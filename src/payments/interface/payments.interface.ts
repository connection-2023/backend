import {
  LectureCoupon,
  LectureSchedule,
  Payment,
  RegularLectureStatus,
  Reservation,
  TransferPaymentInfo,
  UserPass,
} from '@prisma/client';
import { PaymentMethods } from '@src/payments/constants/enum';

export interface ILectureSchedule {
  id?: number;
  lectureScheduleId: number;
  regularLectureStatusId: number;
  participants: number;
}

export interface Coupon {
  id: number;
  title: string;
  percentage: number | null;
  discountPrice: number | null;
  maxDiscountPrice: number | null;
}

export interface ICoupons {
  coupon?: LectureCoupon;
  stackableCoupon?: LectureCoupon;
}

export interface PaymentInputData {
  lecturerId?: number;
  userId?: number;
  orderId: string;
  orderName: string;
  statusId: number;
  originalPrice: number;
  finalPrice: number;
  paymentProductTypeId: number;
  paymentMethodId?: number;
  refundableDate: Date;
}

export interface ReservationInputData {
  userId: number;
  paymentId: number;
  lectureId: number;
  lectureScheduleId?: number;
  regularLectureStatusId?: number;
  representative: string;
  phoneNumber: string;
  participants: number;
  requests?: string | null;
}

export interface LectureCouponUseage {
  lectureCoupon: {
    maxUsageCount: number;
    usageCount: number;
  };
}

export interface PaymentInfo {
  orderId?: string;
  amount?: number;
  paymentKey?: string;
  orderName?: string;
  method?: PaymentMethods;
  value?: number;
  originalPrice?: number;
  finalPrice?: number;
}

export interface TossPaymentsConfirmResponse {
  card?: TossPaymentCardInfo;
  virtualAccount?: TossPaymentVirtualAccountInfo;
  secret?: string;
}

export interface TossPaymentVirtualAccountInfo {
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

export interface CardInfo {
  issuerCode: string;
  acquirerCode?: string | null;
  number: string;
  installmentPlanMonths: number;
  approveNo: string;
  cardType: string;
  ownerType: string;
  isInterestFree: boolean;
}

export interface TossPaymentCardInfo extends CardInfo {
  amount: number;
  interestPayer: null;
  useCardPoint: boolean;
  acquireStatus: string;
}

export interface CardPaymentInfoInputData extends CardInfo {
  paymentId: number;
}

export interface LecturePaymentUpdateData {
  paymentKey: string;
  statusId: number;
}

export interface IPaymentResult {
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
  reservation: IReservationInfo;
  userPass: IUserPass;
}

export interface ICardPaymentInfo {
  number: string;
  installmentPlanMonths: number;
  approveNo: string;
}

export interface IVirtualAccountPaymentInfo {
  accountNumber: string;
  customerName: string;
  dueDate: Date;
  bank: {
    code: string;
    name: string;
  };
}

export interface VirtualAccountPaymentInfoInputData {
  paymentId: number;
  accountNumber: string;
  bankCode: string;
  customerName: string;
  dueDate: Date;
  expired: boolean;
}

export interface IReservationInfo {
  lectureSchedule: ILectureScheduleTime;
  participants: number;
}

export interface IUserPass {
  lecturePass: ILecturePass;
}

export interface ILecturePass {
  id: number;
  availableMonths: number;
}

export interface ILectureScheduleTime {
  lectureId: number;
  startDateTime: Date;
}

export interface ICursor {
  id: number;
}

export interface UserPassInputData {
  userId: number;
  paymentId: number;
  lecturePassId: number;
  remainingUses: number;
}
export interface IPaymentPassUsageInputData {
  paymentId: number;
  lecturePassId: number;
  usedCount: number;
}

export interface ISelectedUserPass extends UserPass {
  lecturePass: {
    availableMonths: number;
    lecturePassTarget: {
      lectureId: number;
    }[];
  };
}

export interface IUserBankAccountInputData extends IBankAccount {
  userId: number;
}

export interface ILecturerBankAccountInputData extends IBankAccount {
  lecturerId: number;
}

interface IBankAccount {
  holderName: string;
  accountNumber: string;
  bankCode: string;
}

export interface ITransferPaymentInputData {
  paymentId: number;
  lecturerBankAccountId: number;
  senderName: string;
  noShowDeposit?: number;
}

export interface IRefundPaymentInputData {
  paymentId: number;
  refundStatusId: number;
  refundUserBankAccountId?: number;
  cancelAmount: number;
  cancelReason: string;
}

export interface IRefundPaymentUpdateData {
  cancelAmount?: number;
  reason?: string;
  refusedReason?: string;
  refundStatusId?: number;
}

export interface IPayment extends Payment {
  transferPaymentInfo: TransferPaymentInfo;
  reservation: IReservation;
}

export interface IReservation extends Reservation {
  lectureSchedule?: LectureSchedule;
  regularLectureStatus?: RegularLectureStatus;
}

export interface IWebHookData {
  createdAt: string;
  secret: string;
  orderId: string;
  status: string;
  transactionKey: string;
}

export interface IRefundPaymentInfo {
  cancelReason: string;
  cancelAmount: number;
  refundReceiveAccount?: IRefundReceiveAccount;
}

export interface IRefundReceiveAccount {
  bank: string;
  holderName: string;
  accountNumber: string;
}

export interface ICalculatedLectureRefundResult {
  refundPrice: number;
  progress?: number;
}

export interface IPaymentWebhookData {
  mId: string;
  version: string;
  lastTransactionKey: string;
  paymentKey: string;
  orderId: string;
  status: string;
  requestedAt: Date;
  approvedAt: Date;
  useEscrow: boolean;
  virtualAccount: TossPaymentVirtualAccountInfo;
  card: TossPaymentCardInfo;
}
