import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiCreateLecturerLike() {
  return applyDecorators(
    ApiOperation({
      summary: '강사 좋아요 생성',
    }),
    ApiBearerAuth(),
    ApiCreatedResponse(
      SwaggerApiResponse.success('강사 좋아요 생성 완료', {
        statusCode: 201,
        data: {
          lecturerLike: {
            id: 1,
            lecturerId: 4,
            userId: 56,
          },
        },
      }),
    ),
  );
}
