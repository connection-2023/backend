import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { GeneralResponseDto } from '@src/common/swagger/dtos/general-response.dto';

export function ApiGetPaymentRequestCount() {
  return applyDecorators(
    ApiOperation({
      summary: '승인 대기중인 요청 개수 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'requestCount', Number),
  );
}
