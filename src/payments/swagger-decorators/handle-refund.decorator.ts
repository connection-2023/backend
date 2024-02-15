import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { StatusResponseDto } from '@src/common/swagger/dtos/status-response.dto';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiHandleRefund() {
  return applyDecorators(
    ApiOperation({
      summary: '강의, 패스권 환불',
    }),
    ApiBearerAuth(),
    StatusResponseDto.swaggerBuilder(HttpStatus.CREATED, 'handleRefund'),
    ApiBadRequestResponse(
      SwaggerApiResponse.exception([
        {
          name: 'InvalidPaymentInformation',
          example: { message: '잘못된 결제 정보입니다.' },
        },
        {
          name: 'CannotRefundLectureWithPass',
          example: { message: '패스권으로 결제한 강의는 환불할 수 없습니다.' },
        },
        {
          name: 'AlreadyRefunded',
          example: { message: '이미 환불 처리된 결제 정보입니다.' },
        },
        {
          name: 'PaymentNotCompleted',
          example: {
            message: '해당 결제 정보는 결제가 완료되지 않은 결제 정보입니다.',
          },
        },
        {
          name: 'RefundPeriodNotAvailable',
          example: { message: '환불 가능 기간이 아닙니다.' },
        },
        {
          name: 'InvalidReservationInformation',
          example: { message: '올바르지 않은 예약 정보입니다.' },
        },
        {
          name: 'RefundAmountMismatch',
          example: { message: '환불 가격이 일치하지 않습니다.' },
        },
        {
          name: 'RefundAccountRequired',
          example: { message: '환불 계좌가 필요한 결제입니다.' },
        },
        {
          name: 'InvalidRefundAccount',
          example: { message: '유효하지 않은 환불 계좌 정보입니다.' },
        },
      ]),
    ),
  );
}
