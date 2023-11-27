import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { IssuedPassFilterOptions, PassStatusOptions } from '../enum/pass.enum';

export class GetMyIssuedPassListDto {
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
    description: '현재 페이지/첫 요청 시 0 or undefined',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  currentPage: number;

  @ApiProperty({
    example: '3',
    description: '이동할 페이지/첫 요청 시 0  or undefined',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  targetPage: number;

  @ApiProperty({
    example: '1',
    description: '반환된 내역의 첫번째 id/첫 요청 시 0  or undefined',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  firstItemId: number;

  @ApiProperty({
    example: '15',
    description: '반환된 내역의 마지막 id/첫 요청 시 0  or undefined',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  lastItemId: number;

  @ApiProperty({
    example: 'AVAILABLE',
    description: 'AVAILABLE, DISABLED 중 하나',
    required: true,
  })
  @IsEnum(PassStatusOptions, { each: true })
  @Transform(({ value }) => value.toUpperCase())
  @IsNotEmpty()
  passStatusOptions: PassStatusOptions;

  @ApiProperty({
    example: 'LATEST',
    description: 'LATEST, HIGHEST_PRICE,BEST_SELLING 중 하나',
    required: true,
  })
  @IsEnum(IssuedPassFilterOptions, { each: true })
  @Transform(({ value }) => value.toUpperCase())
  @IsNotEmpty()
  filterOption: IssuedPassFilterOptions;

  @ApiProperty({
    example: 1,
    description: '원하는 클래스 ID',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  lectureId: number;
}
