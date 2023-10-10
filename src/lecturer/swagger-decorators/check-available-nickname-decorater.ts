import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiCheckAvailableNickname() {
  return applyDecorators(
    ApiOperation({
      summary: '닉네임 중복 검사',
      description: '사용가능하면 true, 불가능하면 false',
    }),
    ApiOkResponse(
      SwaggerApiResponse.success('닉네임 사용가능 or 불가능', {
        status: true || false,
      }),
    ),
  );
}
