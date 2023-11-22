export enum PaymentMethods {
  카드 = 1,
  가상계좌 = 2,
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

export enum VirtualAccountRefundStatus {
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

// export enum CardTypes {
//   '기업 BC' = '3K',
//   '광주은행' = '46',
//   '롯데카드' = '71',
//   'KDB산업은행' = '30',
//   'BC카드' = '31',
//   '삼성카드' = '51',
//   '새마을금고' = '38',
//   '신한카드' = '41',
//   '신협' = '62',
//   '씨티카드' = '36',
//   '우리BC카드(BC 매입)' = '33',
//   '우리카드(우리 매입)' = 'W1',
//   '우체국예금보험' = '37',
//   '저축은행중앙회' = '39',
//   '전북은행' = '35',
//   '제주은행' = '42',
//   '카카오뱅크' = '15',
//   '케이뱅크' = '3A',
//   '토스뱅크' = '24',
//   '하나카드' = '21',
//   '현대카드' = '61',
//   'KB국민카드' = '11',
//   'NH농협카드' = '91',
//   'Sh수협은행' = '34',
// }
