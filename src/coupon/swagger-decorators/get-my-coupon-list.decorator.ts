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

export function ApiGetMyCouponList() {
  return applyDecorators(
    ApiOperation({
      summary: '보유 쿠폰 목록 조회',
      description: '보유 쿠폰 목록 조회',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('반환값 없음', {
        statusCode: 200,
        data: {
          coupons: [
            {
              isUsed: true,
              lectureCoupon: {
                title: '지금까지 이런 쿠폰은 없었다.',
                isPrivate: false,
                maxUsageCount: 100,
                usageCount: 8,
                percentage: null,
                discountPrice: 5000,
                maxDiscountPrice: null,
                startAt: '2023-01-19T00:00:00.000Z',
                endAt: '2024-01-19T00:00:00.000Z',
                isDisabled: false,
                lectureCouponTarget: [
                  {
                    lecture: {
                      id: 2,
                      title: '가비쌤과 함께하는 왁킹 클래스',
                    },
                  },
                ],
              },
            },
            {
              isUsed: false,
              lectureCoupon: {
                title: '지금까지 이런 쿠폰은 없었다.',
                isPrivate: false,
                maxUsageCount: 100,
                usageCount: 7,
                percentage: 10,
                discountPrice: null,
                maxDiscountPrice: null,
                startAt: '2023-01-19T00:00:00.000Z',
                endAt: '2024-01-19T00:00:00.000Z',
                isDisabled: false,
                lectureCouponTarget: [
                  {
                    lecture: {
                      id: 2,
                      title: '가비쌤과 함께하는 왁킹 클래스',
                    },
                  },
                  {
                    lecture: {
                      id: 4,
                      title: '가비쌤과 함께하는 왁킹 클래스',
                    },
                  },
                ],
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
