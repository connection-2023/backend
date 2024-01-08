import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import { ExtractEnumKeys } from '@src/common/utils/enum-key-extractor';
import { PaymentMethods } from '@src/payments/enum/payment.enum';

export class PaymentMethodDto implements PaymentMethod {
  id: number;

  @ApiProperty({
    enum: ExtractEnumKeys(PaymentMethods),
    description: '결제 방식',
  })
  name: string;

  constructor(paymentMethodDto: Partial<PaymentMethodDto>) {
    this.name = paymentMethodDto.name;

    Object.assign(this);
  }
}
