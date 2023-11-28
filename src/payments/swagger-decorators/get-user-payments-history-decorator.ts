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

export function ApiGetUserPaymentsHistory() {
  return applyDecorators(
    ApiOperation({
      summary: '결제 내역 조회(유저)',
      description: 'orderId를 통한 결제 영수증 조회(유저)',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('결제 내역 및 데이터 총 개수 반환', {
        statusCode: 200,
        data: {
          totalItemCount: 55,
          paymentHistory: [
            {
              id: 88,
              orderId: 'M123AE88C3CT',
              orderName: '결제 테스트',
              originalPrice: 100000,
              finalPrice: 95000,
              paymentProductType: {
                name: '클래스',
              },
              paymentMethod: null,
              paymentStatus: {
                name: 'READY',
              },
              updatedAt: '2023-11-27T10:07:24.237Z',
              lecturer: {
                profileCardImageUrl: '주소입니다람쥐',
              },
            },
            {
              id: 87,
              orderId: 'M123AEC3CT',
              orderName: '결제 테스트',
              originalPrice: 100000,
              finalPrice: 100000,
              paymentProductType: {
                name: '클래스',
              },
              paymentMethod: null,
              paymentStatus: {
                name: 'READY',
              },
              updatedAt: '2023-11-27T10:04:32.114Z',
              lecturer: {
                profileCardImageUrl: '주소입니다람쥐',
              },
            },
            {
              id: 86,
              orderId: 'M123AECCT',
              orderName: '결제 테스트',
              originalPrice: 100000,
              finalPrice: 100000,
              paymentProductType: {
                name: '클래스',
              },
              paymentMethod: null,
              paymentStatus: {
                name: 'READY',
              },
              updatedAt: '2023-11-27T10:03:55.909Z',
              lecturer: {
                profileCardImageUrl: '주소입니다람쥐',
              },
            },
            {
              id: 83,
              orderId: 'dd99',
              orderName: 'aa',
              originalPrice: 50000,
              finalPrice: 45000,
              paymentProductType: {
                name: '클래스',
              },
              paymentMethod: {
                name: '카드',
              },
              paymentStatus: {
                name: 'CANCELED',
              },
              updatedAt: '2023-11-21T11:57:07.489Z',
              lecturer: {
                profileCardImageUrl: '주소입니다람쥐',
              },
            },
            {
              id: 82,
              orderId: 'dd23199',
              orderName: 'aa',
              originalPrice: 50000,
              finalPrice: 45000,
              paymentProductType: {
                name: '패스권',
              },
              paymentMethod: {
                name: '카드',
              },
              paymentStatus: {
                name: 'CANCELED',
              },
              updatedAt: '2023-11-21T11:57:07.489Z',
              lecturer: {
                profileCardImageUrl: '주소입니다람쥐',
              },
            },
          ],
        },
      }),
    ),
    ApiUnauthorizedResponse(
      SwaggerApiResponse.exception([
        {
          name: 'InvalidTokenFormat',
          example: { message: '잘못된 토큰 형식입니다.' },
        },
      ]),
    ),
  );
}
