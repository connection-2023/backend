import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';

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
    description: '현재 페이지/첫 요청 시 0',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  currentPage: number;

  @ApiProperty({
    example: '3',
    description: '이동할 페이지/첫 요청 시 0',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  targetPage: number;

  @ApiProperty({
    example: '1',
    description: '반환된 내역의 첫번째 id',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  firstItemId: number;

  @ApiProperty({
    example: '15',
    description: '반환된 내역의 마지막 id',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  lastItemId: number;

  @ApiProperty({
    example: '전체',
    description: '전체, 클래스, 패스권 셋 중 하나',
    required: true,
  })
  @IsIn(['전체', '클래스', '패스권'])
  @IsNotEmpty()
  paymentHistoryType: string;
}
