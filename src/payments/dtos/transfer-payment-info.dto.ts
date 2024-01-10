import { TransferPaymentInfo } from '@prisma/client';
import { LecturerBankAccountDto } from '@src/payments/dtos/lecturer-bank-account.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TransferPaymentInfoDto implements TransferPaymentInfo {
  id: number;
  paymentId: number;
  lecturerBankAccountId: number;

  @ApiProperty({
    description: '입금자명',
  })
  senderName: string;

  @ApiProperty({
    type: Number,
    description: '보증금 / 현장결제일때 존재',
    nullable: true,
  })
  noShowDeposit: number;
  @ApiProperty({
    type: LecturerBankAccountDto,
    description: '강사 계좌 정보',
  })
  lecturerBankAccount: LecturerBankAccountDto;

  constructor(transferPayment: Partial<TransferPaymentInfoDto>) {
    this.senderName = transferPayment.senderName;
    this.noShowDeposit = transferPayment.noShowDeposit;
    this.lecturerBankAccount = new LecturerBankAccountDto(
      transferPayment.lecturerBankAccount,
    );

    Object.assign(this);
  }
}
