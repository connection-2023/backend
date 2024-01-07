import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { PaymentDto } from '../dtos/payment.dto';

export function ApiGetUserReceipt() {
  return applyDecorators(
    ApiOperation({
      summary: '결제 영수증 조회(유저)',
      description: 'orderId를 통한 결제 영수증 조회(유저)',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'receipt', PaymentDto),
    ApiNotFoundResponse(
      SwaggerApiResponse.exception([
        {
          name: 'NotFoundPaymentInfo',
          example: { message: '결제 정보가 존재하지 않습니다.' },
        },
      ]),
    ),
    ApiUnauthorizedResponse(
      SwaggerApiResponse.exception([
        {
          name: 'InvalidTokenFormat',
          example: { message: '잘못된 토큰 형식입니다.' },
        },
      ]),
    ),
  );
}
