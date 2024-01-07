import { ApiProperty } from '@nestjs/swagger';
import { RefundStatus } from '@prisma/client';
import { ExtractEnumKeys } from '@src/common/utils/enum-key-extractor';
import { RefundStatuses } from '@src/payments/enum/payment.enum';

export class RefundStatusDto implements RefundStatus {
  id: number;

  @ApiProperty({
    enum: ExtractEnumKeys(RefundStatuses),
    description: '거절 이유',
    nullable: true,
  })
  name: string;

  constructor(refundStatus: Partial<RefundStatusDto>) {
    this.name = refundStatus.name;

    Object.assign(this);
  }
}
