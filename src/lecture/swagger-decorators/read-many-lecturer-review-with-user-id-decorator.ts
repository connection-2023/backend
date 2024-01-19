import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';
import { LecturerReviewResultDto } from '../dtos/read-lecturer-review.dto';

export function ApiReadManyLecturerReviewWithUserId() {
  return applyDecorators(
    ApiOperation({
      summary: '회원/비회원 강사 리뷰 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'lectuerReviews',
      LecturerReviewResultDto,
    ),
  );
}
