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

export function ApiGetPrivateLectureCouponCode() {
  return applyDecorators(
    ApiOperation({
      summary: '비공개 쿠폰 코드 발행',
      description: '비공개 쿠폰 코드 발행',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('쿠폰 코드 반환', {
        statusCode: 200,
        data: {
          privateCouponCode: '969f76a4b9b708ae3c27a7171080e9c0',
        },
      }),
    ),
    ApiNotFoundResponse(
      SwaggerApiResponse.exception([
        {
          name: 'CouponNotFound',
          example: { message: '쿠폰이 존재하지 않습니다.' },
        },
      ]),
    ),
    ApiBadRequestResponse(
      SwaggerApiResponse.exception([
        {
          name: 'DisabledCoupon',
          example: { message: '비활성화 된 쿠폰입니다.' },
        },
        {
          name: 'CouponAllocationExhausted',
          example: { message: '모든 쿠폰 할당량이 소진되었습니다.' },
        },
        {
          name: 'InvalidCouponType',
          example: { message: '해당 쿠폰은 비공개 or 공개쿠폰 입니다.' },
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
