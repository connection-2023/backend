import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiUpdateLecturerNickname() {
  return applyDecorators(
    ApiOperation({
      summary: '강사 닉네임 변경',
      description: '닉네임 중복 검사 후 닉네임 변경',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('데이터 반환 없음', {
        statusCode: 200,
      }),
    ),
    ApiBadRequestResponse(
      SwaggerApiResponse.exception([
        {
          name: 'duplicatedLecturerNickname',
          example: {
            statusCode: 400,
            message: '닉네임 중복입니다.',
            error: 'duplicatedLecturerNickname',
          },
        },
      ]),
    ),
  );
}
