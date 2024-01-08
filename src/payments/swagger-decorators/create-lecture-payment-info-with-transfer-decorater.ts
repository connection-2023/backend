import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { PaymentDto } from '../dtos/payment.dto';

export function ApiCreateLecturePaymentWithTransfer() {
  return applyDecorators(
    ApiOperation({
      summary: '일반결제(선결제)',
      description: '전체 금액 계좌이체로 결제(쿠폰 사용 가능)',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.CREATED,
      'paymentResult',
      PaymentDto,
    ),
    ApiBadRequestResponse(
      SwaggerApiResponse.exception([
        {
          name: 'DuplicateOrderId',
          example: { message: '주문Id가 중복되었습니다.' },
        },
        {
          name: 'ProductPriceMismatch',
          example: { message: '상품 가격이 일치하지 않습니다.' },
        },
        {
          name: 'DuplicateDiscount',
          example: { message: '할인율은 중복적용이 불가능합니다.' },
        },
        {
          name: 'PaymentAlreadyExists',
          example: { message: '결제정보가 이미 존재합니다.' },
        },
      ]),
    ),
    ApiNotFoundResponse(
      SwaggerApiResponse.exception([
        {
          name: 'NoAvailableCouponsError',
          example: { message: '사용가능한 중복 쿠폰이 존재하지 않습니다.' },
        },
      ]),
    ),
  );
}
