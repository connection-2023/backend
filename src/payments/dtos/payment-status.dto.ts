import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';
import { PaymentOrderStatus } from '@src/payments/enum/payment.enum';
import { ExtractEnumKeys } from '@src/common/utils/enum-key-extractor';

export class PaymentStatusDto implements PaymentStatus {
  id: number;

  @ApiProperty({
    enum: ExtractEnumKeys(PaymentOrderStatus),
    description: '결제 상태',
  })
  name: string;

  constructor(paymentStatus: Partial<PaymentStatusDto>) {
    this.name = paymentStatus.name;

    Object.assign(this);
  }
}
