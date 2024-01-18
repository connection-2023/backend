import { ApiProperty } from '@nestjs/swagger';
import { LecturerPaymentDto } from './lecturer-payment.dto';
import { PaymentBaseLectureDto } from './payment-base-lecture.dto';

export class PaymentRequestDto {
  @ApiProperty({
    type: PaymentBaseLectureDto,
    description: '강의 정보',
  })
  lecture: PaymentBaseLectureDto;

  @ApiProperty({
    type: [LecturerPaymentDto],
    description: '신청 정보',
  })
  payments: LecturerPaymentDto[];

  constructor(paymentRequest: Partial<PaymentRequestDto>) {
    this.lecture = new PaymentBaseLectureDto(paymentRequest.lecture);
    this.payments = paymentRequest.payments.map(
      (payment) => new LecturerPaymentDto(payment),
    );

    Object.assign(this);
  }
}
