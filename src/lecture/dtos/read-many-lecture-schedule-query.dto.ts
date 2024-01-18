import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReadManyLectureScheduleQueryDto {
  @ApiProperty({ example: 2023, description: '년', required: true })
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
