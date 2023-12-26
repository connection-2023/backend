import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { UserReportDto } from '@src/common/dtos/use-report.dto';

export function ApiGetUserReportList() {
  return applyDecorators(
    ApiOperation({
      summary: '신고 목록 조회',
      description: '신고한 목록 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'reportList',
      UserReportDto,
      {
        isArray: true,
      },
    ),
    ApiBadRequestResponse(
      SwaggerApiResponse.exception([
        {
          name: 'ReviewerAndTargetMismatch',
          example: { message: '리뷰 작성자와 신고 대상이 일치하지 않습니다.' },
        },
        {
          name: 'InvalidReportType',
          example: { message: '잘못된 신고 타입입니다.' },
        },
        {
          name: 'AlreadyReported',
          example: { message: '이미 신고 접수된 사용자입니다.' },
        },
      ]),
    ),
    ApiNotFoundResponse(
      SwaggerApiResponse.exception([
        {
          name: 'ReviewNotFound',
          example: { message: '리뷰가 존재하지 않습니다.' },
        },
      ]),
    ),
    ApiUnauthorizedResponse(
      SwaggerApiResponse.exception([
        {
          name: 'InvalidTokenFormat',
          example: { message: '잘못된 토큰 형식입니다.' },
        },
      ]),
    ),
  );
}
