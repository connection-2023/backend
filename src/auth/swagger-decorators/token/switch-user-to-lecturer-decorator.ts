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

export function ApiSwitchUserToLecturer() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 => 강사 전환',
      description: 'userAccessToken을 사용하여 강사 토큰으로 전환',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success(
        '강사 전용 lecturerAccessToken 반환 및 쿠키엔 refreshToken 저장',
        {
          statusCode: 200,
          data: {
            lecturerAccessToken: '토오오큰',
          },
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
