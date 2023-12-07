import {
  ApiBearerAuth,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';
import { StatusResponseDto } from '@src/common/swagger/dtos/status-response.dto';

export function ApiCreateReport() {
  return applyDecorators(
    ApiOperation({
      summary: '신고하기',
      description:
        '유저, 강사, 강의 리뷰, 강사 리뷰 신고 가능 / 신고 type은 schema 확인',
    }),
    ApiBearerAuth(),
    StatusResponseDto.swaggerBuilder(HttpStatus.CREATED),
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
