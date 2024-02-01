import { ApiProperty } from '@nestjs/swagger';
import { EnrollLectureType } from '@src/common/enum/enum';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ReadManyEnrollLectureQueryDto {
  @ApiProperty({ example: 2024, description: '년', required: true })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  year: number;

  @ApiProperty({ example: 1, description: '월', required: true })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  month: number;
}
