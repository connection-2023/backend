import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiCreateLecturerBlock() {
  return applyDecorators(
    ApiOperation({
      summary: '강사 차단 생성',
    }),
    ApiBearerAuth(),
    ApiCreatedResponse(
      SwaggerApiResponse.success('강사 차단 생성 완료', {
        statusCode: 201,
        data: {
          lecturerBlock: {
            id: 1,
            lecturerId: 4,
            userId: 56,
          },
        },
      }),
    ),
  );
}
