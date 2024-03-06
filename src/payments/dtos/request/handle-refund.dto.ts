import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class HandleRefundDto {
  @ApiProperty({
    description: ' 취소 사유',
    required: true,
  })
  @IsNotEmpty()
  cancelReason: string;

  @ApiProperty({
    description: '환불 금액',
    required: true,
  })
  @IsNotEmpty()
  refundAmount: number;

  @ApiProperty({
    description: '유저 계좌정보 Id * 결제 방식이 계좌이체일때 필수*',
    required: false,
  })
  @IsOptional()
  userBankAccountId: number;
}
