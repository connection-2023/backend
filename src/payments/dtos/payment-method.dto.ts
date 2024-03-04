import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import { ExtractEnumKeys } from '@src/common/utils/enum-key-extractor';
import { PaymentMethods } from '@src/payments/enum/payment.enum';
import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class PaymentMethodDto implements PaymentMethod {
  id: number;

  @ApiProperty({
    enum: ExtractEnumKeys(PaymentMethods),
    description: '결제 방식',
  })
  @Expose()
  name: string;

  constructor(paymentMethodDto: Partial<PaymentMethodDto>) {
    Object.assign(this, paymentMethodDto);
  }
}
