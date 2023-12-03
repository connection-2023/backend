import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ReportFilterOptions } from '../eunm/report-enum';
import { IsNumberType } from '@src/common/validator/custom-validator';

export class GetMyReportListDto {
  @ApiProperty({
    example: '15',
    description: '반환되는 결과의 개수',
    required: true,
  })
  @IsNumberType()
  @IsNotEmpty()
  take: number;

  @ApiProperty({
    example: '1',
    description: '현재 페이지/첫 요청 시 0 or undefined',
    required: false,
  })
  @IsNumberType()
  @IsOptional()
  currentPage: number;

  @ApiProperty({
    example: '3',
    description: '이동할 페이지/첫 요청 시 0  or undefined',
    required: false,
  })
  @IsNumberType()
  @IsOptional()
  targetPage: number;

  @ApiProperty({
    example: '1',
    description: '반환된 내역의 첫번째 id/첫 요청 시 0  or undefined',
    required: false,
  })
  @IsNumberType()
  @IsOptional()
  firstItemId: number;

  @ApiProperty({
    example: '15',
    description: '반환된 내역의 마지막 id/첫 요청 시 0  or undefined',
    required: false,
  })
  @IsNumberType()
  @IsOptional()
  lastItemId: number;

  @ApiProperty({
    example: 'ALL',
    enum: ReportFilterOptions,
    required: true,
  })
  @IsEnum(ReportFilterOptions, { each: true })
  @Transform(({ value }) => value.toUpperCase())
  @IsNotEmpty()
  filterOption: ReportFilterOptions;
}
