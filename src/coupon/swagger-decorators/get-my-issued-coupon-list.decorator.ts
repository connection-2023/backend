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
      SwaggerApiResponse.success('반환값 없음', {
        statusCode: 200,
        data: {
          coupons: [
            {
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
              isStackable: false,
              lectureCouponTarget: [
                {
                  lecture: {
                    id: 2,
                    title: '가비쌤과 함께하는 왁킹 클래스',
                  },
                },
              ],
              createdAt: '2023-10-31T09:14:23.062Z',
              updatedAt: '2023-11-01T10:12:04.866Z',
              deletedAt: null,
            },
            {
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
              isStackable: true,
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
              createdAt: '2023-10-31T09:14:37.196Z',
              updatedAt: '2023-11-01T10:12:04.866Z',
              deletedAt: null,
            },
            {
              title: '5천원 할인 쿠폰.',
              isPrivate: true,
              maxUsageCount: 100,
              usageCount: 0,
              percentage: null,
              discountPrice: 5000,
              maxDiscountPrice: null,
              startAt: '2023-01-19T00:00:00.000Z',
              endAt: '2024-01-19T00:00:00.000Z',
              isDisabled: false,
              isStackable: false,
              lectureCouponTarget: [
                {
                  lecture: {
                    id: 2,
                    title: '가비쌤과 함께하는 왁킹 클래스',
                  },
                },
              ],
              createdAt: '2023-11-03T06:49:46.601Z',
              updatedAt: '2023-11-03T06:49:46.601Z',
              deletedAt: null,
            },
            {
              title: '5천원 할인 쿠폰.',
              isPrivate: true,
              maxUsageCount: 100,
              usageCount: 0,
              percentage: null,
              discountPrice: 5000,
              maxDiscountPrice: null,
              startAt: '2023-01-19T00:00:00.000Z',
              endAt: '2024-01-19T00:00:00.000Z',
              isDisabled: false,
              isStackable: false,
              lectureCouponTarget: [],
              createdAt: '2023-11-03T07:00:45.027Z',
              updatedAt: '2023-11-03T07:00:45.027Z',
              deletedAt: null,
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
