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

export function ApiRefreshToken() {
  return applyDecorators(
    ApiOperation({
      summary: '토큰 재발급',
      description: 'cookie의 refreshToken을 사용하여 유저또는 강사 토큰 재발급',
    }),
    ApiOkResponse(
      SwaggerApiResponse.success(
        'userAccessToken또는 lecturerAccessToken  반환 및 쿠키엔 refreshToken 저장',
        {
          statusCode: 200,
          data: {
            userAccessToken: '토오오큰',
            lecturerAccessToken: '토오오큰',
          },
        },
      ),
    ),
    ApiBadRequestResponse(
      SwaggerApiResponse.exception([
        {
          name: 'InvalidLecturerInformation',
          example: { message: '유효하지 않는 강사 정보 요청입니다.' },
        },
        {
          name: 'InvalidUserInformation',
          example: { message: '유효하지 않는 유저 정보 요청입니다.' },
        },
      ]),
    ),
    ApiUnauthorizedResponse(
      SwaggerApiResponse.exception([
        {
          name: 'InvalidTokenFormat',
          example: { message: '잘못된 토큰 형식입니다.' },
        },
        {
          name: 'ExpiredLoginInformation',
          example: {
            message: '로그인 정보가 만료되었습니다. 다시 로그인해 주세요',
          },
        },
        {
          name: 'InvalidLoginInformation',
          example: {
            message: '로그인 정보가 일치하지 않습니다. 다시 로그인해 주세요',
          },
        },
      ]),
    ),
  );
}
