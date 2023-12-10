import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StatusResponseDto } from '@src/common/swagger/dtos/status-response.dto';

export function ApiDeleteLectureCoupon() {
  return applyDecorators(
    ApiOperation({
      summary: '쿠폰 삭제',
    }),
    ApiBearerAuth(),
    StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'deleteReport'),
  );
}
