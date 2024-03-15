import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExceptionResponseDto } from '@src/common/swagger/dtos/exeption-response.dto';
import { StatusResponseDto } from '@src/common/swagger/dtos/status-response.dto';

export function ApiDeleteSingleSearchHistory() {
  return applyDecorators(
    ApiOperation({
      summary: '검색 기록 단일 삭제',
    }),
    ApiBearerAuth(),
    StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'deleteSearchHistory'),
    ExceptionResponseDto.swaggerBuilder(HttpStatus.BAD_REQUEST, [
      {
        error: 'SearchHistoryNotFound',
        description: '존재하지 않는 검색 기록입니다.',
      },
    ]),
    ExceptionResponseDto.swaggerBuilder(HttpStatus.NOT_FOUND, [
      {
        error: 'MismatchedUser',
        description: '유저 정보가 일치하지 않습니다.',
      },
    ]),
  );
}
