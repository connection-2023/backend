import { ApiProperty } from '@nestjs/swagger';
import { IsNumberType } from '@src/common/validator/custom-validator';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetEnrollLectureListQueryDto {
  @ApiProperty({
    description: '진행중,완료',
    example: '진행중',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ description: 'page', example: 0, required: true })
  @IsNotEmpty()
  @IsNumberType()
  page: number;

  @ApiProperty({ description: 'pageSize', example: 3, required: true })
  @IsNotEmpty()
  @IsNumberType()
  pageSize: number;
}
