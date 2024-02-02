import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { PassSituationDto } from '@src/payments/dtos/response/pass-situationdto';

export function ApiGetMyPassSituation() {
  return applyDecorators(
    ApiOperation({
      summary: '패스권 판매 현황',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'passSituationList',
      PassSituationDto,
      { isArray: true },
    ),
  );
}
