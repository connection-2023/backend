import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ReadManyEnrollLectureQueryDto } from './read-many-enroll-lecture-query.dto';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { LecturerMyReviewType, OrderByEnum } from '@src/common/enum/enum';
import { Type } from 'class-transformer';

export class ReadManyLecturerMyReviewQueryDto {
  @ApiProperty({
    example: '전체',
    description: '전체,진행중인 클래스, 종료된 클래스',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(LecturerMyReviewType, { each: true })
  lecturerMyReviewType: LecturerMyReviewType;

  @ApiProperty({
    example: '15',
    description: '반환되는 결과의 개수',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  take: number;

  @ApiProperty({
    example: '1',
    description: '현재 페이지/첫 요청 시 0 또는 undefined가능',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  currentPage: number;

  @ApiProperty({
    example: '3',
    description: '이동할 페이지/첫 요청 시 0 또는 undefined가능',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  targetPage: number;

  @ApiProperty({
    example: '1',
    description: '반환된 내역의 첫번째 id/  0 또는 undefined가능',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  firstItemId: number;

  @ApiProperty({
    example: '15',
    description: '반환된 내역의 마지막 id/  0 또는 undefined가능',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  lastItemId: number;

  @ApiProperty({
    enum: OrderByEnum,
  })
  @IsEnum(OrderByEnum, { each: true })
  @IsNotEmpty()
  orderBy: OrderByEnum;

  @ApiProperty({ example: 1, description: '강의 id', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lectureId?: number;
}
