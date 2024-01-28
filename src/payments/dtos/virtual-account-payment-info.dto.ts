import { ApiProperty } from '@nestjs/swagger';
import { VirtualAccountPaymentInfo } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class VirtualAccountPaymentInfoDto implements VirtualAccountPaymentInfo {
  @ApiProperty({
    type: Number,
    description: '가상 계좌 정보 Id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '계좌번호',
  })
  @Expose()
  accountNumber: string;

  @ApiProperty({
    description: '은행 식별 코드',
  })
  @Expose()
  bankCode: string;

  @ApiProperty({
    description: '입금자 명',
  })
  @Expose()
  customerName: string;

  @ApiProperty({
    type: Date,
    description: '입금 기한',
  })
  @Expose()
  dueDate: Date;

  @ApiProperty({
    type: Boolean,
    description: '만료여부',
  })
  @Expose()
  expired: boolean;

  paymentId: number;
  constructor(
    virtualAccountPaymentInfo: Partial<VirtualAccountPaymentInfoDto>,
  ) {
    Object.assign(this, virtualAccountPaymentInfo);
  }
}
