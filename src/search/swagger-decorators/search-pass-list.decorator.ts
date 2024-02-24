import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { EsPassDto } from '../dtos/response/es-pass.dto ';

export function ApiSearchPassList() {
  return applyDecorators(
    ApiOperation({
      summary: '패스권 검색 회원/비회원 가능',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'searchedPassList',
      EsPassDto,
      {
        isArray: true,
      },
    ),
  );
}
