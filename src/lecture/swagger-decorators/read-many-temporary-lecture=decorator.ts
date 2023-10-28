import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadManyTemporaryLecture() {
  return applyDecorators(
    ApiOperation({
      summary: '임시저장 목록 조회',
    }),
    ApiBearerAuth(),
    ApiCreatedResponse(
      SwaggerApiResponse.success('임시저장 목록 조회 완료', {
        statusCode: 200,
        data: {
          temporaryLectures: [
            {
              id: 1,
            },
            {
              id: 2,
            },
          ],
        },
      }),
    ),
  );
}
