import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class ReadManyLectureQueryDto {
  @ApiProperty({ example: 1, description: '지역 id', required: false })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  regionId?: number;

  @ApiProperty({ example: 1, description: '지역 id', required: false })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  danceCategoryId?: number;

  @ApiProperty({ example: 1, description: '평점', required: false })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  stars?: number;
}
