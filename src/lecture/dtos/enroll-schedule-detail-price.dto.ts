import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class EnrollScheduleDetailPriceDto {
  @Expose()
  @ApiProperty({ description: 'payment id', type: Number })
  id: number;

  @Expose()
  @ApiProperty({ description: '결제 금액', type: Number })
  finalPrice: number;

  constructor(payment: Partial<EnrollScheduleDetailPriceDto>) {
    Object.assign(this, payment);
  }
}
