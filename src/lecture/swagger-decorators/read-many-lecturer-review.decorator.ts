import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GeneralResponseDto } from '@src/common/swagger/dtos/general-response.dto';
import { CombinedLectureReviewWithCountDto } from '../dtos/combined-lecture-review-with-count.dto';
import { PaginationResponseDto } from '@src/common/swagger/dtos/pagination-response.dto';
import { LectureReviewDto } from '@src/common/dtos/lecture-review.dto';

export function ApiReadManyLecturerReview() {
  return applyDecorators(
    ApiOperation({
      summary: '회원/비회원 강사 리뷰 조회',
    }),
    ApiBearerAuth(),
    PaginationResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'reviews',
      LectureReviewDto,
    ),
  );
}
