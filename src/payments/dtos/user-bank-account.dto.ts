import { ApiProperty } from '@nestjs/swagger';
import { UserBankAccount } from '@prisma/client';

export class UserBankAccountDto implements UserBankAccount {
  @ApiProperty({
    type: Number,
    description: '유저 계좌정보 Id',
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

  userId: number;
  createdAt: Date;

  constructor(userBankAccount: Partial<UserBankAccountDto>) {
    this.id = userBankAccount.id;
    this.bankCode = userBankAccount.bankCode;
    this.holderName = userBankAccount.holderName;
    this.accountNumber = userBankAccount.accountNumber;

    Object.assign(this);
  }
}
