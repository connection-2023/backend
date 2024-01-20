import { ApiProperty } from '@nestjs/swagger';
import { IsNumberType } from '@src/common/validator/custom-validator';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBooleanString,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { LecturerSortOptions, TimeOfDay } from '../enum/search.enum';
import {
  DanceCategory,
  DanceMethod,
  TemporaryWeek,
} from '@src/common/enum/enum';

export class GetLectureSearchResultDto {
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
    type: Boolean,
    description: '강의 인원 형식',
    required: true,
  })
  @IsBooleanString()
  @IsNotEmpty()
  isGroup: Boolean;

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
  @IsEnum(DanceCategory, { each: true })
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
  @ArrayMaxSize(30, { message: '지역은 최대 30개 까지 검색 할 수 있습니다' })
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

  @ApiProperty({
    enum: TemporaryWeek,
    description: '요일',
    isArray: true,
    required: false,
  })
  @ArrayMinSize(1)
  @IsEnum(TemporaryWeek, { each: true })
  @IsOptional()
  days: TemporaryWeek[];

  @ApiProperty({
    enum: TimeOfDay,
    description: '시간 / 전체일때는 다른 요소 포함 x',
    isArray: true,
    required: false,
  })
  @IsEnum(TimeOfDay, { each: true })
  @Transform(({ value }) => value.map((time) => time.toUpperCase()))
  @ArrayMinSize(1)
  @IsOptional()
  timeOfDay: TimeOfDay[];

  @ApiProperty({
    type: Number,
    description: '최소 가격',
    required: false,
  })
  @IsNumberType()
  @IsOptional()
  gtePrice: number;

  @ApiProperty({
    type: Number,
    description: '최대 가격',
    required: false,
  })
  @IsNumberType()
  @IsOptional()
  ltePrice: number;

  @ApiProperty({
    enum: DanceMethod,
    description: '진행 방식',
    required: false,
  })
  @IsEnum(DanceMethod)
  @IsOptional()
  lectureMethod: DanceMethod;

  @ApiProperty({
    type: Date,
    description: '지정 날짜 / 지정 날짜 최소 범위',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  gteDate: Date;

  @ApiProperty({
    type: Date,
    description: '지정 날짜일때 undefined / 지정 날짜 최대 범위',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  lteDate: Date;
}
