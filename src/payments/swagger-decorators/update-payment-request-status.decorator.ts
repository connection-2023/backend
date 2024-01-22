import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { StatusResponseDto } from '@src/common/swagger/dtos/status-response.dto';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';
import { UserBankAccountDto } from '@src/payments/dtos/user-bank-account.dto';

export function ApiUpdatePaymentRequestStatus() {
  return applyDecorators(
    ApiOperation({
      summary: '입금 확인이 필요한 요청 상태 변경',
    }),
    ApiBearerAuth(),
    StatusResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'updatePaymentRequestResult',
    ),
    ApiBadRequestResponse(
      SwaggerApiResponse.exception([
        {
          name: 'InvalidPayment',
          example: { message: '잘못된 결제 정보입니다.' },
        },
        {
          name: 'InvalidPaymentMethod',
          example: {
            message: '해당 결제 정보는 변경이 불가능한 결제 방식입니다.',
          },
        },
        {
          name: 'PaymentStatusAlreadyUpdated',
          example: { message: '해당 결제 정보는 이미 변경된 상태입니다.' },
        },
        {
          name: 'ExceededMaxParticipants',
          example: { message: '최대 인원 초과로 인해 취소할 수 없습니다.' },
        },
        {
          name: 'InvalidRefundAmount',
          example: { message: '환불금액이 올바르지 않습니다.' },
        },
      ]),
    ),
  );
}
