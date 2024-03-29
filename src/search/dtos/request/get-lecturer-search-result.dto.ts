import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotBlank,
  IsNumberType,
} from '@src/common/validator/custom-validator';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { LecturerSortOptions } from '../../enum/search.enum';
import { DanceCategory } from '@src/common/enum/enum';

export class GetLecturerSearchResultDto {
  @ApiProperty({
    type: Number,
    description: '조회할 개수',
    required: true,
  })
  @IsNumberType()
  @IsNotEmpty()
  take: number;

  @ApiProperty({
    description: '정렬 옵션',
    enum: LecturerSortOptions,
    required: true,
  })
  @IsEnum(LecturerSortOptions)
  @Transform(({ value }) => value.toUpperCase())
  @IsNotEmpty()
  sortOption: LecturerSortOptions;

  @ApiProperty({
    description: '검색어',
    required: false,
  })
  @Length(1, 50, { message: '값의 길이는 1에서 50 사이여야 합니다.' })
  @IsString()
  @IsOptional()
  value: string;

  @ApiProperty({
    type: Number,
    description: '강사 마지막 아이템의 searchAfter',
    example: [1703758467000, 0.78375864],
    isArray: true,
    required: false,
  })
  @ArrayMinSize(1)
  @Transform(({ value }) => value.map(Number))
  @IsArray()
  @IsOptional()
  searchAfter: number[];

  @ApiProperty({
    enum: DanceCategory,
    description: '장르',
    isArray: true,
    required: false,
  })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  genres: DanceCategory[];

  @ApiProperty({
    example: ['서울특별시 도봉구'],
    description: '지역',
    isArray: true,
    required: false,
  })
  @ArrayMaxSize(30, { message: '지역은 최대 30개 까지 선택 할 수 있습니다.' })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  regions: string[];

  @ApiProperty({
    description: '최소 별점',
    type: Number,
    required: false,
  })
  @IsNumberType()
  @IsOptional()
  stars: number;
}
