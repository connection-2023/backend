import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { UserBankAccountDto } from '@src/payments/dtos/user-bank-account.dto';

export function ApiGetUserRecentBankAccount() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 최근 등록(사용)한 계좌 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'userRecentBankAccount',
      UserBankAccountDto,
    ),
  );
}
