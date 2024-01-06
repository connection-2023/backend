import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { UserBankAccountDto } from '@src/payments/dtos/user-bank-account.dto';

export function ApiCreateUserBankAccount() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 계좌 등록',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.CREATED,
      'createdUserBankAccount',
      UserBankAccountDto,
    ),
  );
}
