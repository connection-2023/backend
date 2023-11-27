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

export function ApiGetUserReceipt() {
  return applyDecorators(
    ApiOperation({
      summary: '결제 영수증 조회(유저)',
      description: 'orderId를 통한 결제 영수증 조회(유저)',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('영수증에 필요한 정보 반환', {
        statusCode: 200,
        data: {
          receipt: {
            orderId: 'cardOrder6',
            orderName: '단스강의',
            originalPrice: 50000,
            finalPrice: 45000,
            paymentProductType: {
              name: '강의',
            },
            paymentMethod: {
              name: '카드',
            },
            createdAt: '2023-11-10T05:54:05.750Z',
            updatedAt: '2023-11-10T05:55:58.635Z',
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
            virtualAccountPaymentInfo: null,
            paymentCouponUsage: {
              couponTitle: null,
              couponDiscountPrice: null,
              couponMaxDiscountPrice: null,
              couponPercentage: null,
              stackableCouponTitle: '지금까지 이런 쿠폰은 없었다.',
              stackableCouponPercentage: 10,
              stackableCouponDiscountPrice: null,
              stackableCouponMaxDiscountPrice: null,
            },
          },
        },
      }),
    ),
    ApiNotFoundResponse(
      SwaggerApiResponse.exception([
        {
          name: 'NotFoundPaymentInfo',
          example: { message: '결제 정보가 존재하지 않습니다.' },
        },
      ]),
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
