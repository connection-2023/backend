import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LecturerBankAccountDto } from '../dtos/lecturer-bank-account.dto';

export function ApiCreateLecturerBankAccount() {
  return applyDecorators(
    ApiOperation({
      summary: '강사 계좌 등록',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.CREATED,
      'createdLecturerBankAccount',
      LecturerBankAccountDto,
    ),
  );
}
