import { ApiProperty } from '@nestjs/swagger';
import { CardPaymentInfo } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { CardTypes } from '../enum/payment.enum';

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

  @ApiProperty({
    description: '카드 매입사 숫자 코드',
  })
  @Expose()
  acquirerCode: string;

  @ApiProperty({
    description: '카드 번호 (일부번호 마스킹)',
  })
  @Expose()
  number: string;

  @ApiProperty({
    type: Number,
    description: '할부 개월 수. 일시불이면 0',
  })
  @Expose()
  installmentPlanMonths: number;

  @ApiProperty({
    description: '승인번호',
  })
  @Expose()
  approveNo: string;

  @ApiProperty({
    enum: CardTypes,
    description: '카드 종류',
  })
  @Expose()
  cardType: string;

  ownerType: string;
  isInterestFree: boolean;
  paymentId: number;

  constructor(cardPaymentInfo: Partial<CardPaymentInfoDto>) {
    Object.assign(this, cardPaymentInfo);
  }
}
