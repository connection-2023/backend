import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LecturerBankAccountDto } from '@src/payments/dtos/lecturer-bank-account.dto';

export function ApiGetLecturerRecentBankAccount() {
  return applyDecorators(
    ApiOperation({
      summary: '강사가 최근 등록(사용)한 계좌 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'lecturerRecentBankAccount',
      LecturerBankAccountDto,
    ),
  );
}
