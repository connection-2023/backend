import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateLectureReviewDto {
  @ApiProperty({ example: 1, description: '강의 id', required: true })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  lectureId: number;

  @ApiProperty({ example: 1, description: '예약 id', required: true })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  reservationId: number;

  @ApiProperty({ example: 5, description: '평점', required: true })
  @IsNotEmpty()
  @IsNumber()
  @Max(5)
  @Min(0)
  @Type(() => Number)
  stars: number;

  @ApiProperty({
    example: "수업이 정말 좋아요 I'm 신뢰에요",
    description: '리뷰 글',
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;
}
