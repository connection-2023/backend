import { ApiProperty } from '@nestjs/swagger';
import { BankEnum } from '@src/common/enum/enum';
import { IsIn, IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateBankAccountDto {
  @ApiProperty({
    enum: Object.values(BankEnum),
    description: '은행 식별 코드',
    required: true,
  })
  @IsIn(Object.values(BankEnum))
  @IsNotEmpty()
  bankCode: BankEnum;

  @ApiProperty({
    description: '예금주 명',
    required: true,
  })
  @IsNotEmpty()
  holderName: string;

  @ApiProperty({
    description: '계좌번호',
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  accountNumber: string;
}
