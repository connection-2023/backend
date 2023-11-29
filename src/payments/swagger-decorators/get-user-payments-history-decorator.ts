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
              id: 100,
              orderId: 'MENH-Xzqla107423414144nXAE44CCT',
              orderName: '결제 테스트',
              originalPrice: 100000,
              finalPrice: 33333,
              paymentProductType: {
                name: '패스권',
              },
              paymentMethod: {
                name: '카드',
              },
              paymentStatus: {
                name: 'DONE',
              },
              updatedAt: '2023-11-28T08:35:45.918Z',
              reservation: [],
              userPass: [
                {
                  lecturePass: {
                    id: 2,
                    title: '페이커의 날카로운 패스',
                    maxUsageCount: 10,
                    availableMonths: 3,
                  },
                },
              ],
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
              reservation: [
                {
                  participants: 2,
                  requests: '',
                  lectureSchedule: {
                    lectureId: 2,
                    startDateTime: '2023-10-03T11:00:00.000Z',
                    lecture: {
                      lectureImage: [
                        {
                          imageUrl: '이미지url1',
                        },
                      ],
                    },
                  },
                },
              ],
              userPass: [],
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
              reservation: [
                {
                  participants: 1,
                  requests: '',
                  lectureSchedule: {
                    lectureId: 2,
                    startDateTime: '2023-10-03T11:00:00.000Z',
                    lecture: {
                      lectureImage: [
                        {
                          imageUrl: '이미지url1',
                        },
                      ],
                    },
                  },
                },
              ],
              userPass: [],
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
