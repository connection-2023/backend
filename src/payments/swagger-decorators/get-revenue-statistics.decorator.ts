import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { RevenueStatisticDto } from '../dtos/response/revenue-statistic.dto';

export function ApiGetRevenueStatistics() {
  return applyDecorators(
    ApiOperation({
      summary: '수익 통계',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'revenueStatistics',
      RevenueStatisticDto,
      { isArray: true },
    ),
  );
}
