import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { PaymentDto } from './payment.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PendingPaymentInfoDto extends PickType(PaymentDto, [
  'orderId',
  'orderName',
]) {
  @ApiProperty({
    description: '주문 uuid',
  })
  @Expose()
  orderId: string;
  @ApiProperty({
    description: '주문명',
  })
  @Expose()
  orderName: string;
  @ApiProperty({
    type: Number,
    description: '금액',
  })
  @Expose()
  value: number;
  constructor(pendingPaymentInfo: Partial<PendingPaymentInfoDto>) {
    super();

    Object.assign(this, pendingPaymentInfo);
  }
}
