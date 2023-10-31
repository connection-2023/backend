import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';
export function ApiUpdateLecturerProfile() {
  return applyDecorators(
    ApiOperation({
      summary: '강사 프로필 업데이트',
      description: '#업데이트 된 데이터만 담아주세요#',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('강사 프로필 업데이트 완료', {
        statusCode: 200,
      }),
    ),
  );
}
