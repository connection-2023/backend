import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LecturerReviewResultDto } from '../dtos/read-lecturer-review.dto';
import { GeneralResponseDto } from '@src/common/swagger/dtos/general-response.dto';

export function ApiReadManyLecturerReview() {
  return applyDecorators(
    ApiOperation({
      summary: '회원/비회원 강사 리뷰 조회',
    }),
    ApiBearerAuth(),
    GeneralResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'lectuerReviews',
      LecturerReviewResultDto,
    ),
  );
}
