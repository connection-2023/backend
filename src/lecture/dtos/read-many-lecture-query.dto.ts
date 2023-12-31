import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  DanceCapacity,
  DanceCategory,
  DanceMethod,
} from '@src/common/enum/enum';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ReadManyLectureQueryDto {
  @ApiPropertyOptional({
    example: ['서울특별시 도봉구', '서울특별시 중구'],
    description: '강사 강의 지역',
    required: false,
  })
  @IsArray()
  @IsOptional()
  @Type(() => Array)
  regions?: string[];

  @ApiPropertyOptional({
    example: ['K-pop', '팝핑'],
    description: '강사 강의 장르',
    required: false,
  })
  @IsArray()
  @IsEnum(DanceCategory, { each: true })
  @IsOptional()
  genres?: DanceCategory[];

  @ApiPropertyOptional({
    example: '원데이',
    description: '강의 방식 (원데이,정기)',
    required: false,
  })
  @IsString()
  @IsEnum(DanceMethod, { each: true })
  @IsOptional()
  lectureMethod?: DanceMethod;

  @ApiPropertyOptional({
    example: '개인',
    description: '강의 인원 (개인,그룹)',
    required: false,
  })
  @IsString()
  @IsEnum(DanceCapacity, { each: true })
  @IsOptional()
  individualGroup?: string;

  @ApiPropertyOptional({ example: '4', description: '평점', required: false })
  @IsNumber()
  @IsOptional()
  @Max(5)
  @Min(0)
  @Type(() => Number)
  stars?: number;

  @ApiProperty({
    type: Number,
    isArray: true,
    example: [10000, 10000000],
    description: '가격',
    required: false,
  })
  @IsOptional()
  @Type(() => Array)
  priceRange?: number[];

  @ApiProperty({
    example: [
      'Tue Oct 03 2023 20:00:00 GMT+0900 (Korean Standard Time)',
      'Tue Oct 03 2023 20:00:00 GMT+0900 (Korean Standard Time)',
      'Tue Oct 03 2023 20:00:00 GMT+0900 (Korean Standard Time)',
    ],
    description: '일정',
    required: false,
  })
  @IsArray()
  @IsOptional()
  @Type(() => Array)
  schedules?: string[];

  @ApiProperty({
    example: '최신순,별점순,가격낮은순',
    description: '정렬',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  orderBy: string;

  @ApiProperty({ example: 0, description: 'page', required: true })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;

  @ApiProperty({ example: 8, description: 'pageSize', required: true })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pageSize: number;
}
