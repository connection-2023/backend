import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiRefreshUserJwtToken() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 토큰 재발급',
      description: 'cookie의 refreshToken을 사용하여 토큰 재발급',
    }),
    ApiOkResponse(
      SwaggerApiResponse.success(
        'userAccessToken 반환 및 쿠키엔 refreshToken 저장',
        {
          statusCode: 200,
          data: {
            userAccessToken: '토오오큰',
          },
        },
      ),
    ),
    ApiBadRequestResponse(
      SwaggerApiResponse.exception([
        {
          name: 'InvalidUserInformation',
          example: { message: '유효하지 않은 유저 정보 요청입니다.' },
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
