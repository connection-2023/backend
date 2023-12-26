import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 15,
    description: '반환되는 결과의 개수',
    type: Number,
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  take: number;

  @ApiProperty({
    example: '1',
    description: '현재 페이지/첫 요청 시 0 or undefined',
    type: Number,
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  currentPage: number;

  @ApiProperty({
    example: 3,
    description: '이동할 페이지/첫 요청 시 0  or undefined',
    type: Number,
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  targetPage: number;

  @ApiProperty({
    example: 1,
    description: '반환된 내역의 첫번째 id/첫 요청 시 0  or undefined',
    type: Number,
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  firstItemId: number;

  @ApiProperty({
    example: 15,
    description: '반환된 내역의 마지막 id/첫 요청 시 0  or undefined',
    type: Number,
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  lastItemId: number;
}
