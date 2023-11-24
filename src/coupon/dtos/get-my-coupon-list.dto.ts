import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import {
  UserCouponFilterOptions,
  UserCouponStatusOptions,
} from '@src/coupon/enum/coupon.enum.ts';

export class GetMyCouponListDto {
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
    example: 'AVAILABLE',
    description: 'AVAILABLE, USED, EXPIRED 중 하나',
    required: true,
  })
  @IsEnum(UserCouponStatusOptions, { each: true })
  @Transform(({ value }) => value.toUpperCase())
  @IsNotEmpty()
  couponStatusOption: UserCouponStatusOptions;

  @ApiProperty({
    example: 'LATEST',
    description: '(AVAILABLE일때만)LATEST, UPCOMING 중 하나',
    required: true,
  })
  @IsEnum(UserCouponFilterOptions, { each: true })
  @Transform(({ value }) => value.toUpperCase())
  @IsNotEmpty()
  filterOption: UserCouponFilterOptions;
}
