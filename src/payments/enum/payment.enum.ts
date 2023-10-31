export enum PaymentMethods {
  카드 = '카드',
  가상계좌 = '가상계좌',
}

export enum PaymentStatus {
  READY = 'READY',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_FOR_DEPOSIT = 'WAITING_FOR_DEPOSIT',
  DONE = 'DONE',
  CANCELED = 'CANCELED',
  PARTIAL_CANCELED = 'PARTIAL_CANCELED',
  ABORTED = 'ABORTED',
  EXPIRED = 'EXPIRED',
}

export enum RefundStatus {
  NONE = 'NONE',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  PARTIAL_FAILED = 'PARTIAL_FAILED',
  COMPLETED = 'COMPLETED',
}
