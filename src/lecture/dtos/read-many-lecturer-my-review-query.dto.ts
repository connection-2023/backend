import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ReadManyEnrollLectureQueryDto } from './read-many-enroll-lecture-query.dto';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { LecturerMyReviewType } from '@src/common/enum/enum';
import { Type } from 'class-transformer';

export class ReadManyLecturerMyReviewQueryDto extends OmitType(
  ReadManyEnrollLectureQueryDto,
  ['enrollLectureType'] as const,
) {
  @ApiProperty({
    example: '전체',
    description: '전체,진행중인 클래스, 종료된 클래스',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(LecturerMyReviewType, { each: true })
  lecturerMyReviewType: LecturerMyReviewType;

  @ApiProperty({
    example: '최신순,좋아요순,평점 높은순,평점 낮은순',
    description: '조회 정렬',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  orderBy: string;

  @ApiProperty({ example: 1, description: '강의 id', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lectureId?: number;
}
