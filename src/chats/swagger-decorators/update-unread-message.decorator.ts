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

export function ApiUpdateUnreadMessage() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅 메세지 읽음 처리',
    }),
    StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'updateUnreadMessage'),
  );
}
