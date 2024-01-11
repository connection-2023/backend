import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { PaymentRequestDto } from '../dtos/payment-request.dto';

export function ApiGetPaymentRequestList() {
  return applyDecorators(
    ApiOperation({
      summary: '입금 확인이 필요한 요청 목록 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'requestList',
      PaymentRequestDto,
      { isArray: true },
    ),
  );
}
