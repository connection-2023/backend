import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ReadManyEnrollLectureQueryDto } from './read-many-enroll-lecture-query.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { LecturerMyReviewType } from '@src/common/enum/enum';

export class ReadManyLecturerReviewQueryDto extends OmitType(
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
}
