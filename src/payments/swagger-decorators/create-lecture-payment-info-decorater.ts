import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiCreateLecturePaymentInfo() {
  return applyDecorators(
    ApiOperation({
      summary: '결제 정보 생성',
      description: '반환받은 결제 정보를 통해 토스에게 요청',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('결제 정보 반환', {
        statusCode: 201,
        data: {
          lecturePaymentInfo: {
            orderId: '2-d822654-43233444122223e4-a0b33d-1 b5',
            orderName: '단스강의',
            value: 35000,
            method: '카드',
          },
        },
      }),
    ),
  );
}
