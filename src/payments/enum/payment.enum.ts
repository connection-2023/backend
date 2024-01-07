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
}

export enum RefundStatuses {
  NONE = 1,
  PENDING,
  FAILED,
  PARTIAL_FAILED,
  COMPLETED,
}

export enum PaymentProductTypes {
  클래스 = '클래스',
  패스권 = '패스권',
}

export enum PaymentHistoryTypes {
  전체 = '전체',
  클래스 = '클래스',
  패스권 = '패스권',
}
