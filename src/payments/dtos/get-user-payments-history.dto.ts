import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { PaymentHistoryTypes } from '../enum/payment.enum';

export class GetUserPaymentsHistoryDto {
  @ApiProperty({
    example: '15',
    description: '반환되는 결과의 개수',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  take: number;

  @ApiProperty({
    example: '1',
    description: '현재 페이지/첫 요청 시 0 또는 undefined가능',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  currentPage: number;

  @ApiProperty({
    example: '3',
    description: '이동할 페이지/첫 요청 시 0 또는 undefined가능',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  targetPage: number;

  @ApiProperty({
    example: '1',
    description: '반환된 내역의 첫번째 id/  0 또는 undefined가능',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  firstItemId: number;

  @ApiProperty({
    example: '15',
    description: '반환된 내역의 마지막 id/  0 또는 undefined가능',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  lastItemId: number;

  @ApiProperty({
    example: '전체',
    description: '전체, 클래스, 패스권 중 하나',
    required: true,
  })
  @IsEnum(PaymentHistoryTypes, { each: true })
  @IsNotEmpty()
  paymentHistoryType: PaymentHistoryTypes;
}
