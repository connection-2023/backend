import { ApiProperty } from '@nestjs/swagger';
import { PaymentDto } from './payment.dto';

export class UserPaymentsHistoryWithCountDto {
  @ApiProperty({
    type: Number,
  })
  totalItemCount: number;

  @ApiProperty({
    type: [PaymentDto],
    description: '결제 내역',
  })
  userPaymentsHistory: PaymentDto[];

  constructor({
    totalItemCount,
    userPaymentsHistory,
  }: Partial<UserPaymentsHistoryWithCountDto>) {
    this.totalItemCount = totalItemCount;
    this.userPaymentsHistory = userPaymentsHistory
      ? userPaymentsHistory.map(
          (paymentHistory) => new PaymentDto(paymentHistory),
        )
      : [];

    Object.assign(this);
  }
}
