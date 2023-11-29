import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiCreateLecturePaymentWithPass() {
  return applyDecorators(
    ApiOperation({
      summary: '패스권으로 클래스 결제',
      description: '결제 내역 반환(신청 완료)',
    }),
    ApiBearerAuth(),
    ApiCreatedResponse(
      SwaggerApiResponse.success('패스권으로 결제한 내역 반환', {
        statusCode: 201,
        data: {
          paymentResult: {
            orderId: 'cc10dc2281-d83365-421413e444-a0bd-24db45b316b5',
            orderName: '단스강의',
            originalPrice: 100000,
            finalPrice: 100000,
            paymentProductType: {
              name: '클래스',
            },
            paymentMethod: {
              name: '패스권',
            },
            createdAt: '2023-11-29T16:26:41.188Z',
            updatedAt: '2023-11-29T16:26:41.188Z',
            paymentPassUsage: {
              usedCount: 2,
              lecturePass: {
                title: '페이커의 날카로운 패스',
              },
            },
            reservation: [
              {
                participants: 2,
                requests: '밥 많이 주세요',
                lectureSchedule: {
                  lectureId: 2,
                  startDateTime: '2023-10-03T11:00:00.000Z',
                },
              },
            ],
          },
        },
      }),
    ),
  );
}
