import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DanceCategory, DanceMethod, LectureType } from '@src/common/enum/enum';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  RegularTemporaryLectureSchedules,
  TemporaryLectureDaySchedules,
  TemporaryLectureLocation,
} from '../interface/temporary-lecture.interface';

export class UpsertTemporaryLectureDto {
  @ApiProperty({ example: 2, description: '임시 강의 id', required: true })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  lectureId: number;

  @ApiProperty({ example: 2, description: '작성하고있는 단계', required: true })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  step: number;

  @ApiProperty({
    example: ['서울특별시 도봉구', '서울특별시 중구'],
    description: '강사 강의 지역',
    required: false,
  })
  @IsArray()
  @IsOptional()
  @Type(() => Array)
  regions?: string[];

  @ApiProperty({ example: 'dance', description: '강의 종류', required: false })
  @IsEnum(LectureType, { each: true })
  @IsOptional()
  @IsString()
  lectureType?: LectureType;

  //원데이,다회차
  @ApiProperty({
    example: '원데이',
    description: '강의 방식 (원데이,정기)',
    required: false,
  })
  @IsEnum(DanceMethod, { each: true })
  @IsOptional()
  lectureMethod?: DanceMethod;

  @ApiProperty({
    example: true,
    description: '강의 인원 형식',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isGroup?: boolean;

  @ApiPropertyOptional({
    example: 'Tue Oct 03 2023',
    description: '강의 시작일',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({
    example: 'Tue Oct 03 2023',
    description: '강의 종료일',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({
    example: '15일 영업 안합니다요',
    description: '강의 공지사항',
    required: false,
  })
  @IsOptional()
  @IsString()
  notification?: string;

  @ApiProperty({
    example: ['K-pop', '팝핑'],
    description: '강사 강의 장르',
    required: false,
  })
  @IsArray()
  @IsEnum(DanceCategory, { each: true })
  @IsOptional()
  genres?: DanceCategory[];

  @ApiProperty({
    example: ['직접입력한 것들', '직접입력한 것들'],
    description: '기타일때 직접입력한 것들',
    required: false,
  })
  @IsArray()
  @IsOptional()
  etcGenres?: string[];

  @ApiProperty({
    example: ['이미지url1', '이미지url2'],
    description: 's3업로드 이미지 url,index 0 이미지가 대표 이미지',
    required: false,
  })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiProperty({
    example: '가비쌤과 함께하는 왁킹 클래스',
    description: '강의 제목',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: '안녕하세용',
    description: '강의 소개',
    required: false,
  })
  @IsOptional()
  @IsString()
  introduction?: string;

  @ApiProperty({
    example: '첫날에 모하징',
    description: '강의 커리큘럼',
    required: false,
  })
  @IsOptional()
  @IsString()
  curriculum?: string;

  @ApiProperty({
    example: {
      address: '서울특별시 중랑구 용마산로616',
      detailAddress: '101동 1802호',
      buildingName: '새한아파트',
    },
    description: '위치 주소',
    required: false,
  })
  @IsOptional()
  @IsObject()
  location?: TemporaryLectureLocation;

  @ApiProperty({ example: 2, description: '강의시간', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  duration?: number;

  @ApiProperty({
    example: '상',
    description: '강의 난이도 상 중 하?',
    required: false,
  })
  @IsOptional()
  @IsString()
  difficultyLevel?: string;

  @ApiProperty({ example: 1, description: '최소 정원', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minCapacity?: number;

  @ApiProperty({ example: 12, description: '최대 정원', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxCapacity?: number;

  @ApiProperty({
    example: 1,
    description: '강의 예약 마감일',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  reservationDeadline?: number;

  @ApiProperty({
    example: '누구나 가능한!',
    description: '예약설명',
    required: false,
  })
  @IsOptional()
  @IsString()
  reservationComment?: string;

  @ApiProperty({ example: 40000, description: '가격', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price?: number;

  @ApiProperty({
    example: 30000,
    description: '노쇼 방지 선금',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  noShowDeposit?: number;

  @ApiProperty({
    example: [
      'Tue Oct 03 2023 20:00:00 GMT+0900 (Korean Standard Time)',
      'Tue Oct 03 2023 20:00:00 GMT+0900 (Korean Standard Time)',
      'Tue Oct 03 2023 20:00:00 GMT+0900 (Korean Standard Time)',
    ],
    description: '클래스 일정',
    required: false,
  })
  @IsArray()
  @IsOptional()
  @Type(() => Array)
  schedules?: string[];

  @ApiProperty({
    example: [
      { day: ['월', '화'], startDateTime: ['13:00', '14:00'] },
      { day: ['월', '화'], startDateTime: ['13:00', '14:00'] },
      { day: ['월', '화'], startDateTime: ['13:00', '14:00'] },
    ],
    description: '원데이 클래스 일정',
    required: false,
  })
  @IsArray()
  @IsOptional()
  daySchedules?: TemporaryLectureDaySchedules[];

  @ApiProperty({
    example: [
      { team: 'A', day: ['월', '화'], startDateTime: ['13:00', '14:00'] },
      { team: 'B', day: ['월', '화'], startDateTime: ['13:00', '14:00'] },
      { team: 'C', day: ['월', '화'], startDateTime: ['13:00', '14:00'] },
    ],
    description: '정기 클래스일 때 일정',
    required: false,
  })
  @IsArray()
  @IsOptional()
  regularSchedules?: RegularTemporaryLectureSchedules[];

  @ApiProperty({
    example: [
      'Tue Oct 03 2023 20:00:00 GMT+0900 (Korean Standard Time)',
      'Tue Oct 03 2023 20:00:00 GMT+0900 (Korean Standard Time)',
      'Tue Oct 03 2023 20:00:00 GMT+0900 (Korean Standard Time)',
    ],
    description: '클래스 휴무일',
    required: false,
  })
  @IsArray()
  @IsOptional()
  @Type(() => Array)
  holidays?: string[];

  @ApiProperty({
    example: [1, 2],
    description: '강의 생성시 적용할 쿠폰 id',
    required: false,
  })
  @IsArray()
  @IsOptional()
  @Type(() => Array)
  coupons?: number[];

  @ApiPropertyOptional({
    example: '버스타고 한번에',
    description: '위치설명',
    required: false,
  })
  @IsString()
  @IsOptional()
  locationDescription?: string;
}
