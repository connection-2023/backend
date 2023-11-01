import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiConfirmLecturePayment() {
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
              orderId: 'adkqmg12222dd22',
              orderName: '단스강의',
              price: 40000,
              paymentProductType: {
                name: '강의',
              },
              paymentMethod: {
                name: '카드 또는 가상계좌',
              },
              createdAt: '2023-11-01T10:47:48.783Z',
              updatedAt: '2023-11-01T10:48:25.718Z',
              cardPaymentInfo: {
                number: '53275080****161*',
                installmentPlanMonths: 0,
                approveNo: '00000000',
                issuer: {
                  code: '24',
                  name: '토스뱅크',
                },
                acquirer: {
                  code: '21',
                  name: '하나카드',
                },
              },
              virtualAccountPaymentInfo: {
                accountNumber: 'X6516208618951',
                customerName: '김토스',
                dueDate: '2023-11-08T10:51:12.000Z',
                bank: {
                  code: '20',
                  name: '우리은행',
                },
              },
            },
          },
        },
      ),
    ),
  );
}
