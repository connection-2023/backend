import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiGetMyIssuedCouponList() {
  return applyDecorators(
    ApiOperation({
      summary: '발급한 쿠폰 목록 조회',
      description: '발급한 쿠폰 목록 조회',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('쿠폰 목록 반환', {
        statusCode: 200,
        data: {
          totalItemCount: 6,
          couponList: [
            {
              id: 8,
              title: '최최종 쿠폰',
              isPrivate: true,
              maxUsageCount: 100,
              usageCount: 0,
              percentage: null,
              discountPrice: 5000,
              maxDiscountPrice: null,
              startAt: '2023-01-19T00:00:00.000Z',
              endAt: '2025-01-19T00:00:00.000Z',
              isDisabled: false,
              isStackable: false,
              createdAt: '2023-11-22T13:55:42.580Z',
              updatedAt: '2023-11-22T13:55:42.580Z',
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
            {
              id: 6,
              title: '새로운 쿠폰',
              isPrivate: true,
              maxUsageCount: 100,
              usageCount: 0,
              percentage: null,
              discountPrice: 5000,
              maxDiscountPrice: null,
              startAt: '2023-01-19T00:00:00.000Z',
              endAt: '2123-01-18T00:00:00.000Z',
              isDisabled: false,
              isStackable: false,
              createdAt: '2023-11-22T13:53:47.844Z',
              updatedAt: '2023-11-22T13:53:47.844Z',
              lectureCouponTarget: [],
            },
            {
              id: 5,
              title: '5천원 할인 쿠폰.',
              isPrivate: true,
              maxUsageCount: 100,
              usageCount: 0,
              percentage: null,
              discountPrice: 5000,
              maxDiscountPrice: null,
              startAt: '2023-01-19T00:00:00.000Z',
              endAt: '2553-01-11T00:00:00.000Z',
              isDisabled: false,
              isStackable: false,
              createdAt: '2023-11-03T07:00:45.027Z',
              updatedAt: '2023-11-03T07:00:45.027Z',
              lectureCouponTarget: [],
            },
            {
              id: 2,
              title: '지금까지 이런 쿠폰은 없었다.',
              isPrivate: false,
              maxUsageCount: 100,
              usageCount: 15,
              percentage: 10,
              discountPrice: null,
              maxDiscountPrice: null,
              startAt: '2023-01-19T00:00:00.000Z',
              endAt: '2024-02-19T00:00:00.000Z',
              isDisabled: false,
              isStackable: true,
              createdAt: '2023-10-31T09:14:37.196Z',
              updatedAt: '2023-11-10T05:58:03.815Z',
              lectureCouponTarget: [
                {
                  lecture: {
                    id: 4,
                    title: '가비쌤과 함께하는 왁킹 클래스',
                  },
                },
              ],
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
