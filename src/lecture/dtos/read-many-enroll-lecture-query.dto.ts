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
  @ApiProperty({
    example: '15',
    description: '반환되는 결과의 개수',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  take: number;

  @ApiProperty({ example: 1, description: '스킵할 개수', required: true })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  skip: number;

  @ApiProperty({
    example: '진행중',
    description: '진행중,수강 완료',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(EnrollLectureType, { each: true })
  enrollLectureType: EnrollLectureType;
}
