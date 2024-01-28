import { ApiProperty } from '@nestjs/swagger';
import { CardPaymentInfo } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CardPaymentInfoDto implements CardPaymentInfo {
  @ApiProperty({
    type: Number,
    description: '가상 계좌 정보 Id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '카드 발급사 숫자 코드',
  })
  @Expose()
  issuerCode: string;
  acquirerCode: string;
  number: string;
  installmentPlanMonths: number;
  approveNo: string;
  cardType: string;
  ownerType: string;
  isInterestFree: boolean;
  paymentId: number;
}
