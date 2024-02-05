import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { MyPassDto } from '../dtos/pass.dto';

export function ApiGetMyIssuedPass() {
  return applyDecorators(
    ApiOperation({
      summary: '패스권 Id로 발급한 패스권 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'myPass', MyPassDto),
  );
}
