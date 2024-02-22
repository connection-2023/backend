import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodDto } from '@src/payments/dtos/payment-method.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class EnrollScheduleDetailPriceDto {
  @Expose()
  @ApiProperty({ description: 'payment id', type: Number })
  id: number;

  @Expose()
  @ApiProperty({ description: '결제 금액', type: Number })
  finalPrice: number;

  @Expose()
  @ApiProperty({ description: '결제 수단', type: PaymentMethodDto })
  paymentMethod: PaymentMethodDto;

  constructor(payment: Partial<EnrollScheduleDetailPriceDto>) {
    Object.assign(this, payment);
  }
}
