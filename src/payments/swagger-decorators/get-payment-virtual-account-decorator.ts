import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiPaymentVirtualAccount() {
  return applyDecorators(
    ApiOperation({
      summary: '가상 계좌 조회(유저)',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('영수증에 필요한 정보 반환', {
        statusCode: 200,
        data: {
          price: 45000,
          virtualAccountPaymentInfo: {
            accountNumber: 'X9940003656612',
            customerName: '김토스',
            dueDate: '2023-11-17T05:58:44.000Z',
            bank: {
              code: '07',
              name: 'Sh수협은행',
            },
          },
        },
      }),
    ),
  );
}
