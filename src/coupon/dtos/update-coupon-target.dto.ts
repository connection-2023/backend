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
    example: '적용할 강의Id',
    description: '1개일 때도 배열',
    required: true,
  })
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsNotEmpty()
  lectureIds: number[];
}
