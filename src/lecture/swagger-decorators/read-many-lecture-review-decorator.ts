import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LectureReviewDto } from '@src/common/dtos/lecture-review.dto';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';

export function ApiReadManyLectureReview() {
  return applyDecorators(
    ApiOperation({
      summary: '회원/비회원 강의 리뷰 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'review',
      LectureReviewDto,
      {
        isArray: true,
      },
    ),
  );
}
