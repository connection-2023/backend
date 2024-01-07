import { ApiProperty } from '@nestjs/swagger';
import { LecturerBankAccount } from '@prisma/client';

export class LecturerBankAccountDto implements LecturerBankAccount {
  @ApiProperty({
    type: Number,
    description: '강사 계좌정보 Id',
  })
  id: number;

  @ApiProperty({
    description: '은행 식별 코드',
  })
  bankCode: string;

  @ApiProperty({
    description: '예금주',
  })
  holderName: string;

  @ApiProperty({
    description: '계좌번호',
  })
  accountNumber: string;

  lecturerId: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(lecturerBankAccount: Partial<LecturerBankAccountDto>) {
    this.id = lecturerBankAccount.id;
    this.bankCode = lecturerBankAccount.bankCode;
    this.holderName = lecturerBankAccount.holderName;
    this.accountNumber = lecturerBankAccount.accountNumber;

    Object.assign(this);
  }
}
