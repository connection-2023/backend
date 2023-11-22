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
          paymentCount: 51,
          paymentHistory: [
            {
              id: 84,
              orderId: 'dd100',
              orderName: 'aa',
              price: 50000,
              paymentProductType: {
                name: '패스권',
              },
              paymentMethod: {
                name: '카드',
              },
              paymentStatus: {
                name: 'ABORTED',
              },
              updatedAt: '2023-11-21T11:57:07.539Z',
              lecturer: {
                profileCardImageUrl: '주소입니다람쥐',
              },
            },
            {
              id: 83,
              orderId: 'dd99',
              orderName: 'aa',
              price: 50000,
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
              orderId: 'dd98',
              orderName: 'aa',
              price: 50000,
              paymentProductType: {
                name: '클래스',
              },
              paymentMethod: {
                name: '카드',
              },
              paymentStatus: {
                name: 'DONE',
              },
              updatedAt: '2023-11-21T11:57:07.439Z',
              lecturer: {
                profileCardImageUrl: '주소입니다람쥐',
              },
            },
            {
              id: 81,
              orderId: 'dd94',
              orderName: 'aa',
              price: 50000,
              paymentProductType: {
                name: '클래스',
              },
              paymentMethod: {
                name: '카드',
              },
              paymentStatus: {
                name: 'EXPIRED',
              },
              updatedAt: '2023-11-21T11:57:07.390Z',
              lecturer: {
                profileCardImageUrl: '주소입니다람쥐',
              },
            },
            {
              id: 80,
              orderId: 'dd93',
              orderName: 'aa',
              price: 50000,
              paymentProductType: {
                name: '클래스',
              },
              paymentMethod: {
                name: '카드',
              },
              paymentStatus: {
                name: 'IN_PROGRESS',
              },
              updatedAt: '2023-11-21T11:57:07.343Z',
              lecturer: {
                profileCardImageUrl: '주소입니다람쥐',
              },
            },
            {
              id: 79,
              orderId: 'dd92',
              orderName: 'aa',
              price: 50000,
              paymentProductType: {
                name: '클래스',
              },
              paymentMethod: {
                name: '카드',
              },
              paymentStatus: {
                name: 'PARTIAL_CANCELED',
              },
              updatedAt: '2023-11-21T11:57:07.294Z',
              lecturer: {
                profileCardImageUrl: '주소입니다람쥐',
              },
            },
            {
              id: 78,
              orderId: 'dd91',
              orderName: 'aa',
              price: 50000,
              paymentProductType: {
                name: '클래스',
              },
              paymentMethod: {
                name: '카드',
              },
              paymentStatus: {
                name: 'WAITING_FOR_DEPOSIT',
              },
              updatedAt: '2023-11-21T11:57:07.239Z',
              lecturer: {
                profileCardImageUrl: '주소입니다람쥐',
              },
            },
            {
              id: 77,
              orderId: 'dd90',
              orderName: 'aa',
              price: 50000,
              paymentProductType: {
                name: '클래스',
              },
              paymentMethod: {
                name: '카드',
              },
              paymentStatus: {
                name: 'CANCELED',
              },
              updatedAt: '2023-11-21T11:57:07.188Z',
              lecturer: {
                profileCardImageUrl: '주소입니다람쥐',
              },
            },
            {
              id: 76,
              orderId: 'dd89',
              orderName: 'aa',
              price: 50000,
              paymentProductType: {
                name: '클래스',
              },
              paymentMethod: {
                name: '카드',
              },
              paymentStatus: {
                name: 'CANCELED',
              },
              updatedAt: '2023-11-21T11:57:07.140Z',
              lecturer: {
                profileCardImageUrl: '주소입니다람쥐',
              },
            },
            {
              id: 75,
              orderId: 'dd88',
              orderName: 'aa',
              price: 50000,
              paymentProductType: {
                name: '클래스',
              },
              paymentMethod: {
                name: '카드',
              },
              paymentStatus: {
                name: 'CANCELED',
              },
              updatedAt: '2023-11-21T11:57:07.093Z',
              lecturer: {
                profileCardImageUrl: '주소입니다람쥐',
              },
            },
            {
              id: 74,
              orderId: 'dd87',
              orderName: 'aa',
              price: 50000,
              paymentProductType: {
                name: '클래스',
              },
              paymentMethod: {
                name: '카드',
              },
              paymentStatus: {
                name: 'CANCELED',
              },
              updatedAt: '2023-11-21T11:57:07.048Z',
              lecturer: {
                profileCardImageUrl: '주소입니다람쥐',
              },
            },
            {
              id: 73,
              orderId: 'dd86',
              orderName: 'aa',
              price: 50000,
              paymentProductType: {
                name: '클래스',
              },
              paymentMethod: {
                name: '카드',
              },
              paymentStatus: {
                name: 'CANCELED',
              },
              updatedAt: '2023-11-21T11:57:07.001Z',
              lecturer: {
                profileCardImageUrl: '주소입니다람쥐',
              },
            },
            {
              id: 72,
              orderId: 'dd85',
              orderName: 'aa',
              price: 50000,
              paymentProductType: {
                name: '클래스',
              },
              paymentMethod: {
                name: '카드',
              },
              paymentStatus: {
                name: 'CANCELED',
              },
              updatedAt: '2023-11-21T11:57:06.943Z',
              lecturer: {
                profileCardImageUrl: '주소입니다람쥐',
              },
            },
            {
              id: 71,
              orderId: 'dd84',
              orderName: 'aa',
              price: 50000,
              paymentProductType: {
                name: '클래스',
              },
              paymentMethod: {
                name: '카드',
              },
              paymentStatus: {
                name: 'CANCELED',
              },
              updatedAt: '2023-11-21T11:57:06.891Z',
              lecturer: {
                profileCardImageUrl: '주소입니다람쥐',
              },
            },
            {
              id: 70,
              orderId: 'dd83',
              orderName: 'aa',
              price: 50000,
              paymentProductType: {
                name: '클래스',
              },
              paymentMethod: {
                name: '카드',
              },
              paymentStatus: {
                name: 'CANCELED',
              },
              updatedAt: '2023-11-21T11:57:06.845Z',
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
