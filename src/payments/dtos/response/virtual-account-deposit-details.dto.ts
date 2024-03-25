import { Exclude, Expose, Type } from 'class-transformer';
import { VirtualAccountPaymentInfoDto } from '../virtual-account-payment-info.dto';
import { Payment } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class VirtualAccountDepositDetailsDto
  implements Pick<Payment, 'id' | 'originalPrice' | 'finalPrice'>
{
  @ApiProperty({
    type: Number,
    description: '결제 Id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    type: Number,
    description: '결제 금액',
  })
  @Expose()
  originalPrice: number;

  @ApiProperty({
    type: Number,
    description: '최종 결제 금액',
  })
  @Expose()
  finalPrice: number;

  @ApiProperty({
    type: VirtualAccountPaymentInfoDto,
    description: '가상 계좌 정보',
  })
  @Type(() => VirtualAccountPaymentInfoDto)
  @Expose()
  virtualAccountPaymentInfo: VirtualAccountPaymentInfoDto;
}
