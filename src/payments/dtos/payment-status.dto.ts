import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';
import { PaymentOrderStatus } from '@src/payments/enum/payment.enum';
import { ExtractEnumKeys } from '@src/common/utils/enum-key-extractor';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PaymentStatusDto implements PaymentStatus {
  id: number;

  @ApiProperty({
    enum: ExtractEnumKeys(PaymentOrderStatus),
    description: '결제 상태',
  })
  @Expose()
  name: string;

  constructor(paymentStatus: Partial<PaymentStatusDto> = {}) {
    Object.assign(this, paymentStatus);
  }
}
