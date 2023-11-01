import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmLecturePaymentDto {
  @ApiProperty({
    example: 'dJv2eBNjG0Poxy1XQL8RbO14AnGRDZ87nO5Wmlg96RKwZz4Y',
    description: '토스 승인요청때 반환받은 paymentKey',
    required: true,
  })
  @IsNotEmpty()
  paymentKey: string;

  @ApiProperty({
    example: '단스강의',
    description: '주문명',
    required: true,
  })
  @IsNotEmpty()
  orderName: string;

  @ApiProperty({
    example: 'cc10dc81-d865-43e4-a0bd-24db45b316b5',
    description: '주문Id UUID',
    required: true,
  })
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    example: 5000,
    description: '가격',
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty()
  amount: number;
}
