import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';

export function ApiGetTotalRevenue() {
  return applyDecorators(
    ApiOperation({
      summary: '총 수익',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'totalRevenue', Number),
  );
}
