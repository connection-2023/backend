import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiGetApplicableCouponsForLecture() {
  return applyDecorators(
    ApiOperation({
      summary: '강의에 적용 가능한 공개 쿠폰 조회',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('클래스에 적용 가능한 쿠폰 목록 반환', {
        statusCode: 200,
        data: {
          applicableCoupons: [
            {
              lectureCoupon: {
                id: 1,
                title: '지금까지 이런 쿠폰은 없었다.',
                maxUsageCount: null,
                percentage: null,
                discountPrice: 5000,
                maxDiscountPrice: null,
                isStackable: false,
                startAt: '2023-01-19T00:00:00.000Z',
                endAt: '2024-01-19T00:00:00.000Z',
              },
            },
            {
              lectureCoupon: {
                id: 2,
                title: '지금까지 이런 쿠폰은 없었다.',
                maxUsageCount: 100,
                percentage: 10,
                discountPrice: null,
                maxDiscountPrice: null,
                isStackable: true,
                startAt: '2023-01-19T00:00:00.000Z',
                endAt: '2024-01-19T00:00:00.000Z',
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
