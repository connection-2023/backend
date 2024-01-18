import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import {
  IssuedCouponStatusOptions,
  CouponFilterOptions,
} from '@src/coupon/enum/coupon.enum.ts';

export class GetMyIssuedCouponListDto {
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
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  currentPage: number;

  @ApiProperty({
    example: '3',
    description: '이동할 페이지/첫 요청 시 0',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  targetPage: number;

  @ApiProperty({
    example: '1',
    description: '반환된 내역의 첫번째 id',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  firstItemId: number;

  @ApiProperty({
    example: '15',
    description: '반환된 내역의 마지막 id',
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
  @IsEnum(IssuedCouponStatusOptions, { each: true })
  @Transform(({ value }) => value.toUpperCase())
  @IsNotEmpty()
  couponStatusOption: IssuedCouponStatusOptions;

  @ApiProperty({
    example: 'LATEST',
    description: '(AVAILABLE일때만)LATEST, UPCOMING 중 하나',
    required: true,
  })
  @IsEnum(CouponFilterOptions, { each: true })
  @Transform(({ value }) => value.toUpperCase())
  @IsNotEmpty()
  filterOption: CouponFilterOptions;

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
