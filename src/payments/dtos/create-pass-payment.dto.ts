import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { LectureSchedule } from '@src/payments/interface/payments.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePassPaymentDto {
  @ApiProperty({
    example: 1,
    description: '패스권 Id',
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty()
  passId: number;

  @ApiProperty({
    example: 'cc10dc81-d865-43e4-a0bd-24db45b316b5',
    description: '주문Id UUID',
    required: true,
  })
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    example: '손흥민의 날카로운 패스 10회권',
    description: '주문명',
    required: true,
  })
  @IsNotEmpty()
  orderName: string;

  @ApiProperty({
    example: 10000,
    description: '최초 금액',
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty()
  originalPrice: number;

  @ApiProperty({
    example: 10000,
    description: '최종 결제 금액(패스권은 현시점에선 동일)',
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty()
  finalPrice: number;
}
