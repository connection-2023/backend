import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReadManyLectureReviewQueryDto {
  @ApiProperty({
    example: '최신순,좋아요순,평점 높은순,평점 낮은순',
    description: '조회 정렬',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  orderBy: string;
}
