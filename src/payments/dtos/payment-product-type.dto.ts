import { ApiProperty } from '@nestjs/swagger';
import { PaymentProductType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PaymentProductTypeDto implements PaymentProductType {
  id: number;

  @ApiProperty({
    description: '상품 종류명',
  })
  @Expose()
  name: string;

  constructor(paymentProductType: Partial<PaymentProductTypeDto>) {
    Object.assign(this, paymentProductType);
  }
}
