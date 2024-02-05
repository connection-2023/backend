import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { PaymentDto } from '../dtos/payment.dto';

export function ApiConfirmPayment() {
  return applyDecorators(
    ApiOperation({
      summary: '결제 승인',
      description: '유저 결제 성공시 반환되는 paymentKey를 사용하여 결제 승인',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'paymentResult',
      PaymentDto,
    ),
  );
}
