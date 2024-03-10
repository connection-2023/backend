import {
  ApiBearerAuth,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';
import { PaginationResponseDto } from '@src/common/swagger/dtos/pagination-response.dto';
import { DetailPaymentInfo } from '../dtos/response/detail-payment.dto';

export function ApiGetUserPaymentsHistory() {
  return applyDecorators(
    ApiOperation({
      summary: '결제 내역 조회',
      description: '결제 내역 조회 페이지네이션',
    }),
    ApiBearerAuth(),
    PaginationResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'userPaymentsHistory',
      DetailPaymentInfo,
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
