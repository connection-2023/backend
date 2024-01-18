import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LectureCouponDto } from '@src/common/dtos/lecture-coupon.dto';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';

export function ApiUpdateLectureCoupon() {
  return applyDecorators(
    ApiOperation({
      summary: '쿠폰 수정',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'updatedCoupon',
      LectureCouponDto,
    ),
  );
}
