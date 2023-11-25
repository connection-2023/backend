import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiCancelPayment() {
  return applyDecorators(
    ApiOperation({
      summary: '결제 진행 중 취소',
      description: 'TossPayment 요청 전 취소할때 사용',
    }),
    ApiBearerAuth(),
    ApiCreatedResponse(
      SwaggerApiResponse.success('반환값 없음', {
        statusCode: 201,
      }),
    ),
  );
}
