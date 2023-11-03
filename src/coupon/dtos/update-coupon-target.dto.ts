import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  ValidateIf,
} from 'class-validator';
import { number } from 'joi';

export class UpdateCouponTargetDto {
  @ApiProperty({
    example: '쿠폰Id배열',
    description: '쿠폰 id배열 1개일 때도 배열',
    required: true,
  })
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsNotEmpty()
  couponIds: number[];

  @ApiProperty({
    example: '강의Id',
    description: '강의 id배열 1개일 때도 배열',
    required: true,
  })
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsNotEmpty()
  lectureIds: number[];
}
