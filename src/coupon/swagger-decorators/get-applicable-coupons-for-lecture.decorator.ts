import {
  ApiBearerAuth,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { ApplicableCouponDto } from '../dtos/applicable-coupon.dto';

export function ApiGetCouponListByLectureId() {
  return applyDecorators(
    ApiOperation({
      summary: '[회원/비회원] 강의에 적용 가능한 공개 쿠폰 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'couponList',
      ApplicableCouponDto,
      { isArray: true },
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
