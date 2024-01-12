import { ApiProperty } from '@nestjs/swagger';
import { BankEnum } from '@src/common/enum/enum';
import { IsIn, IsNotEmpty, IsNumberString } from 'class-validator';
import { PaymentStatusForLecturer } from '../enum/payment.enum';
import { IsNumberType } from '@src/common/validator/custom-validator';

export class UpdatePaymentRequestStatusDto {
  @ApiProperty({
    enum: Object.values(PaymentStatusForLecturer),
    description: '주문 상태',
    required: true,
  })
  @IsIn(Object.values(PaymentStatusForLecturer))
  @IsNotEmpty()
  status: PaymentStatusForLecturer;

  @ApiProperty({
    description: 'payment Id',
    required: true,
  })
  @IsNumberType()
  @IsNotEmpty()
  paymentId: number;
}
