import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiGetMyCoupons() {
  return applyDecorators(
    ApiOperation({
      summary: '강사가 발급한 쿠폰 조회',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('발급한 쿠폰이 없으면 빈 배열반환', {
        statusCode: 200,
        data: {
          coupons: [
            {
              id: 1,
              title: '지금까지 이런 쿠폰은 없었다.',
              percentage: 10,
              discountPrice: null,
              isStackable: true,
              maxDiscountPrice: 1000,
              startAt: '2023-01-19T00:00:00.000Z',
              endAt: '2024-01-19T00:00:00.000Z',
            },
          ],
        },
      }),
    ),
  );
}
