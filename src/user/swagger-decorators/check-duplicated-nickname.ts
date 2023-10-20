import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiCheckDubplicatedNickname() {
  return applyDecorators(
    ApiOperation({
      summary: '닉네임 중복 검사',
      description: '사용가능 200, 중복 403',
    }),
    ApiOkResponse(
      SwaggerApiResponse.success('닉네임 사용가능 or 불가능', {
        statusCode: 200,
      }),
    ),
    ApiForbiddenResponse(
      SwaggerApiResponse.exception([
        {
          name: 'dubplicated nickname',
          example: 'duplicated nickname',
        },
      ]),
    ),
  );
}
