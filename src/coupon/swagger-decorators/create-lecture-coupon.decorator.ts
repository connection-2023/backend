import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function ApiCreateLectureCoupon() {
  return applyDecorators(
    ApiOperation({ summary: '강의 쿠폰 생성' }),
    ApiBearerAuth(),
  );
}
