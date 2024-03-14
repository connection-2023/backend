import { BadRequestException } from '@nestjs/common';
import { PaymentOrderStatus } from '@src/payments/constants/enum';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class HandleDepositStatusDto {
  @IsNotEmpty()
  createdAt: string;

  @IsNotEmpty()
  secret: string;

  @Transform(({ value }) => {
    if (!(value.toUpperCase() in PaymentOrderStatus)) {
      throw new BadRequestException(
        `상태가 올바르지 않습니다. input: ${value}`,
      );
    }
    return PaymentOrderStatus[value.toUpperCase()];
  })
  @IsNotEmpty()
  status: PaymentOrderStatus;

  @IsNotEmpty()
  transactionKey: string;

  @IsNotEmpty()
  orderId: string;
}
