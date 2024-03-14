import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { StatusResponseDto } from '@src/common/swagger/dtos/status-response.dto';

export function ApiDeleteAllSearchHistory() {
  return applyDecorators(
    ApiOperation({
      summary: '검색 기록 삭제',
    }),
    StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'deleteAllSearchHistory'),
  );
}
