import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLectureDto {
  @ApiProperty({
    example: ['서울특별시 도봉구', '서울특별시 중구'],
    description: '강사 강의 지역',
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  @Type(() => Array)
  regions: string[];

  @ApiProperty({ example: 1, description: '강의 종류 id', required: true })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  lectureTypeId: number;

  @ApiProperty({ example: 1, description: '춤 장르 id', required: true })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  danceCategoryId: number;

  //원데이,다회차
  @ApiProperty({
    example: 1,
    description: '강의 방식 id(원데이,다회차)',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  lectureMethodId: number;

  @ApiProperty({
    example: '가비쌤과 함께하는 왁킹 클래스',
    description: '강의 제목',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: '안녕하세용',
    description: '강의 소개',
    required: false,
  })
  @IsOptional()
  @IsString()
  introduction: string;

  @ApiProperty({
    example: '첫날에 모하징',
    description: '강의 커리큘럼',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  curriculum: string;

  @ApiProperty({
    example: '용마산로 616 18층',
    description: '상세주소',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  detailAddress: string;

  @ApiProperty({ example: 2, description: '강의시간', required: true })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  duration: number;

  @ApiProperty({
    example: '상',
    description: '강의 난이도 상 중 하?',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  difficultyLevel: string;

  @ApiProperty({ example: 1, description: '최소 정원', required: true })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  minCapacity: number;

  @ApiProperty({ example: 12, description: '최대 정원', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxCapacity: number | null;

  @ApiProperty({
    example: '2023 - 09 - 14',
    description: '강의 예약 마감일',
    required: true,
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  reservationDeadline: Date;

  @ApiProperty({
    example: '누구나 가능한!',
    description: '예약설명',
    required: false,
  })
  @IsOptional()
  @IsString()
  reservationComment: string | null;

  @ApiProperty({ example: 40000, description: '가격', required: true })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty({
    example: 30000,
    description: '노쇼 방지 선금',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  noShowDeposit: number | null;

  @ApiProperty({
    example: [
      '2023-10-11 07:32:54.337',
      '2023-10-11 07:32:54.337',
      '2023-10-11 07:32:54.337',
    ],
    description: '클래스 일정',
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  @Type(() => Array)
  schedules: string[];

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '강의 이미지 파일 업로드',
    required: true,
  })
  files: string;
}
