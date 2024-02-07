import { ApiProperty } from '@nestjs/swagger';
import { RevenueStatisticsType } from '@src/payments/enum/payment.enum';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class GetRevenueStatisticsDto {
  @ApiProperty({
    enum: RevenueStatisticsType,
    description: '수익 정보 반환 형식',
  })
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(RevenueStatisticsType)
  @IsNotEmpty()
  statisticsType: RevenueStatisticsType;

  @ApiProperty({
    type: Date,
    description:
      '!!DAILY 일때 사용가능!! 2024-02-10 이면 이전 날짜 30일 치 반환 02-09, 02-08...',
    required: false,
  })
  @ValidateIf(
    ({ revenueStatisticsType }) =>
      revenueStatisticsType === RevenueStatisticsType.DAILY,
  )
  @IsDateString()
  @IsOptional()
  date: string;
}
