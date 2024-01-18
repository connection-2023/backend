import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateLectureDto {
  @ApiPropertyOptional({
    example: ['imageUrl', 'url'],
    description: '이미지 url',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Type(() => Array)
  images?: string[];

  @ApiPropertyOptional({ example: 1, description: '최소인원', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  minCapacity?: number;

  @ApiPropertyOptional({ example: 5, description: '최대인원', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxCapacity?: number;

  @ApiPropertyOptional({
    example: 'Tue Oct 03 2023 20:00:00 GMT+0900 (Korean Standard Time)',
    description: '마감일',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional({
    example: '잘 운영할 예정',
    description: '강의 소개',
    required: false,
  })
  @IsOptional()
  @IsString()
  introduction?: string;

  @ApiPropertyOptional({
    example: '1주차 휴강',
    description: '커리큘럼',
    required: false,
  })
  @IsOptional()
  @IsString()
  curriculum?: string;

  @ApiPropertyOptional({
    example: 2,
    description: '신청 마감시간',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  reservationDeadline?: number;

  @ApiPropertyOptional({
    example: '신발가져오세요',
    description: '예약 유의사항',
    required: false,
  })
  @IsOptional()
  @IsString()
  reservationComment?: string;

  @ApiPropertyOptional({ example: 40000, description: '가격', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional({
    example: 30000,
    description: '노쇼 방지 선금',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  noShowDeposit?: number;

  @ApiProperty({
    example: [1, 2],
    description: '강의 생성시 적용할 쿠폰 id',
    required: false,
  })
  @IsArray()
  @IsOptional()
  @Type(() => Array)
  coupons?: number[];

  @ApiProperty({
    example: '공지공지공지',
    description: '공지사항',
    required: false,
  })
  @IsOptional()
  @IsString()
  notification?: string;

  @ApiProperty({
    example: [
      'Tue Oct 03 2023 20:00:00 GMT+0900 (Korean Standard Time)',
      'Tue Oct 03 2023 20:00:00 GMT+0900 (Korean Standard Time)',
      'Tue Oct 03 2023 20:00:00 GMT+0900 (Korean Standard Time)',
    ],
    description: '휴무일',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Type(() => Array)
  holidays?: Date[];

  @ApiProperty({
    example: [
      'Tue Oct 03 2023 20:00:00 GMT+0900 (Korean Standard Time)',
      'Tue Oct 03 2023 20:00:00 GMT+0900 (Korean Standard Time)',
      'Tue Oct 03 2023 20:00:00 GMT+0900 (Korean Standard Time)',
    ],
    description: '추가된 스케쥴',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Type(() => Array)
  schedules?: Date[];

  @ApiProperty({
    example: '2층 복도 끝',
    description: '지역 상세설명',
    required: false,
  })
  @IsOptional()
  @IsString()
  locationDescription?: string;
}
