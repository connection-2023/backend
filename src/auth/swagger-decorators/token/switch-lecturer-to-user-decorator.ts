import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiSwitchLecturerToUser() {
  return applyDecorators(
    ApiOperation({
      summary: '강사 => 유저 전환',
      description: 'accessToken을 사용하여 유저 토큰으로 전환',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success(
        '유저 전용 accessToken 반환 및 쿠키엔 refreshToken 저장',
        {
          accessToken: '유저 전용 토큰',
        },
      ),
    ),
    ApiBadRequestResponse(
      SwaggerApiResponse.exception([
        {
          name: 'InvalidUserInformation',
          example: { message: '유효하지 않는 유저 정보 요청입니다.' },
        },
        {
          name: 'InvalidLecturerInformation',
          example: { message: '유효하지 않는 강사 정보 요청입니다.' },
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