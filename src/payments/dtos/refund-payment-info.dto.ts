import { ApiProperty } from '@nestjs/swagger';
import { RefundPaymentInfo } from '@prisma/client';
import { BaseReturnDto } from '@src/common/dtos/base-return.dto';
import { UserBankAccountDto } from '@src/payments/dtos/user-bank-account.dto';
import { RefundStatusDto } from '@src/payments/dtos/refund-status.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class RefundPaymentInfoDto
  extends BaseReturnDto
  implements RefundPaymentInfo
{
  @ApiProperty({
    type: Number,
    description: '환불 정보 Id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    type: RefundStatusDto,
    description: '환불 상태',
  })
  @Expose()
  refundStatus: RefundStatusDto;

  @ApiProperty({
    type: Number,
    description: '환불 금액',
    nullable: true,
  })
  @Expose()
  cancelAmount: number;

  @ApiProperty({
    description: '환불 사유',
  })
  @Expose()
  cancelReason: string;

  @ApiProperty({
    type: UserBankAccountDto,
    description: '환불 받을 계좌 정보',
    nullable: true,
  })
  @Expose()
  @Type(() => UserBankAccountDto)
  refundUserBankAccount: UserBankAccountDto;

  createdAt: Date;
  paymentId: number;
  refundStatusId: number;
  refundUserBankAccountId: number;

  constructor(refundPaymentInfo: Partial<RefundPaymentInfoDto>) {
    super();
    Object.assign(this, refundPaymentInfo);
  }
}
