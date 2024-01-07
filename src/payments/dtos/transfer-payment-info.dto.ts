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
    type: LecturerBankAccountDto,
    description: '강사 계좌 정보',
  })
  lecturerBankAccount: LecturerBankAccountDto;

  constructor(transferPayment: Partial<TransferPaymentInfoDto>) {
    this.senderName = transferPayment.senderName;
    this.lecturerBankAccount = new LecturerBankAccountDto(
      transferPayment.lecturerBankAccount,
    );

    Object.assign(this);
  }
}
