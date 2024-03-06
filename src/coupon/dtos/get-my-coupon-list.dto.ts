import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import {
  CouponFilterOptions,
  UserCouponStatusOptions,
} from '@src/coupon/enum/coupon.enum.ts';
import { PaginationDto } from '@src/common/dtos/pagination.dto';

export class GetMyCouponListDto extends PaginationDto {
  @ApiProperty({
    enum: UserCouponStatusOptions,
    required: true,
  })
  @IsEnum(UserCouponStatusOptions, { each: true })
  @Transform(({ value }) => value.toUpperCase())
  @IsNotEmpty()
  couponStatusOption: UserCouponStatusOptions;

  @ApiProperty({
    enum: CouponFilterOptions,
    description: 'AVAILABLE일때만포함',
    required: false,
  })
  @IsEnum(CouponFilterOptions, { each: true })
  @Transform(({ value }) => value.toUpperCase())
  @ValidateIf(
    ({ couponStatusOption }) =>
      couponStatusOption === UserCouponStatusOptions.AVAILABLE,
  )
  filterOption: CouponFilterOptions;

  @ApiProperty({
    type: [Number],
    required: false,
  })
  @ArrayMinSize(1)
  @Transform(({ value }) => value.map(Number))
  @IsArray()
  @IsOptional()
  lectureIds: number[];
}
