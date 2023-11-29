import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiConfirmPayment() {
  return applyDecorators(
    ApiOperation({
      summary: '결제 승인',
      description: '유저 결제 성공시 반환되는 paymentKey를 사용하여 결제 승인',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success(
        '결제 내역 반환 cardPaymentInfo가 있으면 가상계좌는 null 반대경우도 동일/ 반환값 배열아님 두가지 상황을 보여주기 위한 예시',
        [
          {
            statusCode: 200,
            data: {
              paymentResult: {
                orderId: 'dd99',
                orderName: 'aa',
                originalPrice: 0,
                finalPrice: 0,
                paymentProductType: {
                  name: '클래스',
                },
                paymentMethod: {
                  name: '카드',
                },
                createdAt: '2023-11-21T11:57:07.489Z',
                updatedAt: '2023-11-28T07:23:36.420Z',
                reservation: [
                  {
                    participants: 2,
                    lectureSchedule: {
                      lectureId: 2,
                      startDateTime: '2023-10-03T11:00:00.000Z',
                    },
                  },
                ],
                userPass: [],
                cardPaymentInfo: null,
                virtualAccountPaymentInfo: null,
              },
            },
          },
          {
            statusCode: 200,
            data: {
              paymentResult: {
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
                createdAt: '2023-11-28T06:43:55.066Z',
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
                cardPaymentInfo: null,
                virtualAccountPaymentInfo: null,
              },
            },
          },
        ],
      ),
    ),
  );
}
