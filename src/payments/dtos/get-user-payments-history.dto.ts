import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';
import { number } from 'joi';

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
    example: '15',
    description:
      '건너뛸 항목의 수/ 현재 페이지에서 임의의 페이지로 넘어갈 떄 사용',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  skip: number;

  @ApiProperty({
    example: '70',
    description:
      '반환된 내역의 마지막 id/ 현재 페이지에서 다음, 이전페이지로 넘어갈때 사용',
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
