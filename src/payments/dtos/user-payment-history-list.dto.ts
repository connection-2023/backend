import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { DetailPaymentInfo } from './response/detail-payment.dto';

@Exclude()
export class UserPaymentsHistoryWithCountDto {
  @ApiProperty({
    type: Number,
  })
  @Expose()
  totalItemCount: number;

  @ApiProperty({
    type: [DetailPaymentInfo],
    description: '결제 내역',
  })
  @Type(() => DetailPaymentInfo)
  @Expose()
  userPaymentsHistory: DetailPaymentInfo[];

  constructor(
    userPaymentsHistoryWithCount: Partial<UserPaymentsHistoryWithCountDto>,
  ) {
    Object.assign(this, userPaymentsHistoryWithCount);
  }
}
