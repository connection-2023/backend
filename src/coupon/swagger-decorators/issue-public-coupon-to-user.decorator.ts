import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiIssuePublicCouponToUser() {
  return applyDecorators(
    ApiOperation({
      summary: '클래스 공개(public)쿠폰 받기',
      description: '쿠폰id로 받기',
    }),
    ApiBearerAuth(),
    ApiCreatedResponse(
      SwaggerApiResponse.success('반환값 없음', {
        status: 201,
      }),
    ),
    ApiBadRequestResponse(
      SwaggerApiResponse.exception([
        {
          name: 'CouponAlreadyOwned',
          example: {
            statusCode: HttpStatus.BAD_REQUEST,
            message: '이미 쿠폰을 보유하고있습니다.',
            error: 'CouponAlreadyOwned',
            rejectedCouponId: '1',
          },
        },
        {
          name: 'DisabledCoupon',
          example: {
            statusCode: HttpStatus.BAD_REQUEST,
            message: '비활성화 된 쿠폰입니다.',
            error: 'DisabledCoupon',
            rejectedCouponId: '1',
          },
        },
        {
          name: 'CouponAllocationExhausted',
          example: {
            statusCode: HttpStatus.BAD_REQUEST,
            message: '모든 쿠폰 할당량이 소진되었습니다.',
            error: 'CouponAllocationExhausted',
            rejectedCouponId: '1',
          },
        },
        {
          name: 'InvalidCouponType',
          example: {
            statusCode: HttpStatus.BAD_REQUEST,
            message: '해당 쿠폰은 비공개 or 공개 쿠폰 입니다.',
            error: 'InvalidCouponType',
            rejectedCouponId: 1,
          },
        },
      ]),
    ),
    ApiNotFoundResponse(
      SwaggerApiResponse.exception([
        {
          name: 'CouponNotFound',
          example: {
            statusCode: HttpStatus.NOT_FOUND,
            message: '쿠폰이 존재하지 않습니다.',
            error: 'CouponNotFound',
            rejectedCouponId: 1,
          },
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
