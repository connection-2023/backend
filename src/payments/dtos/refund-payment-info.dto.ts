import { ApiProperty } from '@nestjs/swagger';
import { RefundPaymentInfo } from '@prisma/client';
import { BaseReturnDto } from '@src/common/dtos/base-return.dto';
import { UserBankAccountDto } from '@src/payments/dtos/user-bank-account.dto';
import { RefundStatusDto } from '@src/payments/dtos/refund-status.dto';

export class RefundPaymentInfoDto
  extends BaseReturnDto
  implements RefundPaymentInfo
{
  @ApiProperty({
    type: Number,
    description: '환불 정보 Id',
  })
  id: number;

  @ApiProperty({
    type: RefundStatusDto,
    description: '환불 상태',
  })
  refundStatus: RefundStatusDto;

  @ApiProperty({
    type: Number,
    description: '환불 금액',
    nullable: true,
  })
  cancelAmount: number;

  @ApiProperty({
    description: '환불 사유',
    nullable: true,
  })
  reason: string;

  @ApiProperty({
    description: '거절 이유',
    nullable: true,
  })
  refusedReason: string;
  createdAt: Date;

  @ApiProperty({
    type: UserBankAccountDto,
    description: '환불 받을 계좌 정보',
    nullable: true,
  })
  refundUserBankAccount: UserBankAccountDto;

  paymentId: number;
  refundStatusId: number;
  refundUserBankAccountId: number;

  constructor(refundPaymentInfo: Partial<RefundPaymentInfoDto>) {
    super();

    this.id = refundPaymentInfo.id;
    this.refundStatus = refundPaymentInfo.refundStatus;
    this.cancelAmount = refundPaymentInfo.cancelAmount;
    this.reason = refundPaymentInfo.reason;
    this.refusedReason = refundPaymentInfo.refusedReason;

    this.refundUserBankAccount = new UserBankAccountDto(
      refundPaymentInfo.refundUserBankAccount,
    );

    Object.assign(this);
  }
}
