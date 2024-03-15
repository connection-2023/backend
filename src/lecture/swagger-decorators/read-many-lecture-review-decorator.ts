import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LectureReviewDto } from '@src/common/dtos/lecture-review.dto';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { GeneralResponseDto } from '@src/common/swagger/dtos/general-response.dto';
import { CombinedLectureReviewWithCountDto } from '../dtos/combined-lecture-review-with-count.dto';

export function ApiReadManyLectureReview() {
  return applyDecorators(
    ApiOperation({
      summary: '회원/비회원 강의 리뷰 조회',
    }),
    ApiBearerAuth(),
    GeneralResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'combinedLectureReviewWithCount',
      CombinedLectureReviewWithCountDto,
    ),
  );
}
