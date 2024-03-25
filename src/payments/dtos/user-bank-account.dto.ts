import { ApiProperty } from '@nestjs/swagger';
import { UserBankAccount } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserBankAccountDto implements UserBankAccount {
  @ApiProperty({
    type: Number,
    description: '유저 계좌정보 Id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '은행 식별 코드',
  })
  @Expose()
  bankCode: string;

  @ApiProperty({
    description: '예금주',
  })
  @Expose()
  holderName: string;

  @ApiProperty({
    description: '계좌번호',
  })
  @Expose()
  accountNumber: string;

  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
