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
        '결제 내역 반환 cardPaymentInfo가 있으면 가상계좌는 null 반대경우도 동일',
        {
          statusCode: 200,
          data: {
            paymentResult: {
              orderId: 'cardOrder6',
              orderName: '단스강의',
              originalPrice: 50000,
              finalPrice: 45000,
              paymentProductType: {
                name: '클래스or패스권',
              },
              paymentMethod: {
                name: '카드',
              },
              createdAt: '2023-11-10T05:54:05.750Z',
              updatedAt: '2023-11-10T05:55:58.635Z',
              reservation: [
                {
                  participants: 4,
                  requests: '밥 많이 주세요',
                  lectureSchedule: {
                    lectureId: 2,
                    startDateTime: '2023-10-04T11:00:00.000Z',
                  },
                },
                {
                  participants: 4,
                  requests: '밥 많이 주세요',
                  lectureSchedule: {
                    lectureId: 2,
                    startDateTime: '2023-10-03T11:00:00.000Z',
                  },
                },
              ],
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
              cardPaymentInfo: {
                number: '53275080****161*',
                installmentPlanMonths: 0,
                approveNo: '00000000',
              },
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
          },
        },
      ),
    ),
  );
}