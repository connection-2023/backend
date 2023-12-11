import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ReadManyLecturerMyReviewQueryDto } from './read-many-lecturer-review-query.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { LecturerReviewType } from '@src/common/enum/enum';

export class ReadManyLecturerReviewQueryDto extends OmitType(
  ReadManyLecturerMyReviewQueryDto,
  ['lecturerMyReviewType'] as const,
) {
  @ApiProperty({
    example: '최신순',
    description: '최신순, 좋아요순, 평점 높은순, 평점 낮은순',
  })
  @IsNotEmpty()
  @IsEnum(LecturerReviewType, { each: true })
  lecturerReviewType: LecturerReviewType;
}