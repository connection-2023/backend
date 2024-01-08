import { ApiProperty } from '@nestjs/swagger';
import { PaymentProductType } from '@prisma/client';

export class PaymentProductTypeDto implements PaymentProductType {
  id: number;

  @ApiProperty({
    description: '상품 종류명',
  })
  name: string;

  constructor(paymentProductType: Partial<PaymentProductTypeDto>) {
    this.name = paymentProductType.name;

    Object.assign(this);
  }
}
