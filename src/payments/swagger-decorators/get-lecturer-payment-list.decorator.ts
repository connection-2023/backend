import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaginationResponseDto } from '@src/common/swagger/dtos/pagination-response.dto';
import { LecturerPaymentItemDto } from '../dtos/response/lecturer-payment-item.dto';

export function ApiGetLecturerPaymentList() {
  return applyDecorators(
    ApiOperation({
      summary: '판매 내역',
    }),
    ApiBearerAuth(),
    PaginationResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'lecturerPaymentList',
      LecturerPaymentItemDto,
    ),
  );
}
