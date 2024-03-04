import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiCreatePassPaymentInfo() {
  return applyDecorators(
    ApiOperation({
      summary: '패스권 결제 정보 생성',
      description: '반환받은 결제 정보를 통해 토스에게 요청',
    }),
    ApiBearerAuth(),
    ApiCreatedResponse(
      SwaggerApiResponse.success('결제에 필요한 정보 반환', {
        statusCode: 201,
        data: {
          passPaymentInfo: {
            orderId: 'adkqmg12222dd1',
            orderName: '손흥민의 날카로운 패스',
            value: 40000,
          },
        },
      }),
    ),
    ApiBadRequestResponse(
      SwaggerApiResponse.exception([
        {
          name: 'DuplicateOrderId',
          example: { message: '주문Id가 중복되었습니다.' },
        },
        {
          name: 'PassInfoNotFound',
          example: { message: '패스권 정보가 존재하지 않습니다.' },
        },
        {
          name: 'ProductPriceMismatch',
          example: { message: '상품 가격이 일치하지 않습니다.' },
        },
        {
          name: 'PaymentAlreadyExists',
          example: { message: '결제정보가 이미 존재합니다.' },
        },
        {
          name: 'AlreadyPurchasedPass',
          example: { message: '이미 구매한 패스권입니다.' },
        },
        {
          name: 'ProductDisabled',
          example: { message: '상품이 판매 중지되었습니다.' },
        },
      ]),
    ),
  );
}
