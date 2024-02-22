import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { StatusResponseDto } from '@src/common/swagger/dtos/status-response.dto';
import { ExceptionResponseDto } from '@src/common/swagger/dtos/exeption-response.dto';

export function ApiUpdateLearnerMemo() {
  return applyDecorators(
    ApiOperation({
      summary: '수강생 메모 수정',
    }),
    ApiBearerAuth(),
    StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'updateLearnerMemo'),
    ExceptionResponseDto.swaggerBuilder(HttpStatus.NOT_FOUND, [
      {
        error: 'LearnerInfoNotFound',
        description: '수강생 정보를 찾을 수 없습니다.',
      },
    ]),
  );
}
