import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiApplyLectureCoupon() {
  return applyDecorators(
    ApiOperation({
      summary: '쿠폰 적용대상 설정',
      description: '쿠폰 대상 적용',
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
          name: 'InvalidClassIncluded',
          example: { message: '유효하지 않은 클래스가 포함되었습니다.' },
        },
        {
          name: 'InvalidCouponIncluded',
          example: { message: '존재하지 않거나 유효하지 않은 쿠폰입니다.' },
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
