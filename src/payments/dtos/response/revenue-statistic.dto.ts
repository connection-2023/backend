import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RevenueStatisticDto {
  @ApiProperty({
    description: 'DAILY일때 yyyy-mm-dd, MONTHLY일때 yyyy-mm',
  })
  @Expose()
  date: string;

  @ApiProperty({
    type: Number,
    description: '총 판매량',
  })
  @Expose()
  totalSales: number;

  @ApiProperty({
    type: Number,
    description: '총 판매 금액',
  })
  @Expose()
  totalPrice: number;

  constructor(revenueStatistic: Partial<RevenueStatisticDto>) {
    Object.assign(this, revenueStatistic);
  }
}
