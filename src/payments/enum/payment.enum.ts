export enum PaymentMethods {
  카드 = 1,
  가상계좌,
  패스권,
  현장결제,
  선결제,
}

export enum PaymentOrderStatus {
  READY = 1,
  IN_PROGRESS,
  CANCELED,
  WAITING_FOR_DEPOSIT,
  PARTIAL_CANCELED,
  DONE,
  ABORTED,
  EXPIRED,
  REFUSED,
}

export enum RefundStatuses {
  NONE = 1,
  PENDING,
  FAILED,
  PARTIAL_FAILED,
  COMPLETED,
  USER_PENDING,
  LECTURER_PENDING,
}

export enum PaymentProductTypes {
  클래스 = '클래스',
  패스권 = '패스권',
}

export enum PaymentHistoryTypes {
  전체 = 0,
  클래스 = 1,
  패스권 = 2,
}

export enum PaymentStatusForLecturer {
  WAITING_FOR_DEPOSIT = PaymentOrderStatus.WAITING_FOR_DEPOSIT,
  DONE = PaymentOrderStatus.DONE,
  REFUSED = PaymentOrderStatus.REFUSED,
}

export enum LectureMethod {
  '원데이' = 1,
  '정기' = 2,
}

export enum CardTypes {
  신용 = '신용',
  체크 = '체크',
  기프트 = '기프트',
  미확인 = '미확인',
}

export enum RevenueStatisticsType {
  MONTHLY = 'MONTHLY',
  DAILY = 'DAILY',
}

export enum LecturerPaymentStatus {
  CANCELED = PaymentOrderStatus.CANCELED,
  WAITING_FOR_DEPOSIT = PaymentOrderStatus.WAITING_FOR_DEPOSIT,
  PARTIAL_CANCELED = PaymentOrderStatus.PARTIAL_CANCELED,
  DONE = PaymentOrderStatus.DONE,
}
