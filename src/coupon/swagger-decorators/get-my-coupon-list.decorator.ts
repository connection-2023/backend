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
      SwaggerApiResponse.success('쿠폰 목록 반환', {
        statusCode: 200,
        data: {
          totalItemCount: 7,
          couponList: [
            {
              id: 7,
              lectureCouponId: 2,
              isUsed: true,
              updatedAt: '2023-11-10T05:58:03.815Z',
              lectureCoupon: {
                title: '지금까지 이런 쿠폰은 없었다.',
                isPrivate: false,
                maxUsageCount: 100,
                usageCount: 15,
                percentage: 10,
                discountPrice: null,
                maxDiscountPrice: null,
                startAt: '2023-01-19T00:00:00.000Z',
                endAt: '2023-02-19T00:00:00.000Z',
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
              },
            },
            {
              id: 11,
              lectureCouponId: 8,
              isUsed: false,
              updatedAt: '2023-11-22T17:32:55.514Z',
              lectureCoupon: {
                title: '최최종 쿠폰',
                isPrivate: true,
                maxUsageCount: 100,
                usageCount: 0,
                percentage: null,
                discountPrice: 5000,
                maxDiscountPrice: null,
                startAt: '2023-01-19T00:00:00.000Z',
                endAt: '2023-01-19T00:00:00.000Z',
                isDisabled: false,
                isStackable: false,
                lectureCouponTarget: [],
              },
            },
            {
              id: 1,
              lectureCouponId: 1,
              isUsed: true,
              updatedAt: '2023-11-01T10:12:04.866Z',
              lectureCoupon: {
                title: '지금까지 이런 쿠폰은 없었다.',
                isPrivate: false,
                maxUsageCount: null,
                usageCount: 2,
                percentage: null,
                discountPrice: 5000,
                maxDiscountPrice: null,
                startAt: '2023-01-19T00:00:00.000Z',
                endAt: '2023-01-19T00:00:00.000Z',
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
              },
            },
            {
              id: 33,
              lectureCouponId: 6,
              isUsed: false,
              updatedAt: '2023-11-22T17:33:18.476Z',
              lectureCoupon: {
                title: '새로운 쿠폰',
                isPrivate: true,
                maxUsageCount: 100,
                usageCount: 0,
                percentage: null,
                discountPrice: 5000,
                maxDiscountPrice: null,
                startAt: '2023-01-19T00:00:00.000Z',
                endAt: '2023-01-18T00:00:00.000Z',
                isDisabled: false,
                isStackable: false,
                lectureCouponTarget: [],
              },
            },
            {
              id: 8,
              lectureCouponId: 5,
              isUsed: false,
              updatedAt: '2023-11-06T14:24:17.240Z',
              lectureCoupon: {
                title: '5천원 할인 쿠폰.',
                isPrivate: true,
                maxUsageCount: 100,
                usageCount: 0,
                percentage: null,
                discountPrice: 5000,
                maxDiscountPrice: null,
                startAt: '2023-01-19T00:00:00.000Z',
                endAt: '2023-01-11T00:00:00.000Z',
                isDisabled: false,
                isStackable: false,
                lectureCouponTarget: [],
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
