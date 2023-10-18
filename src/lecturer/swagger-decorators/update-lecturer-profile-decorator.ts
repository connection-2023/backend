import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';
export function UpdateLecturerProfile() {
  return applyDecorators(
    ApiOperation({
      summary: '강사 프로필 업데이트',
      description: '강사 프로필 업데이트',
    }),
    ApiBearerAuth(),
    ApiCreatedResponse(
      SwaggerApiResponse.success('강사 프로필 업데이트 완료', {
        statusCode: 201,
      }),
    ),
  );
}
