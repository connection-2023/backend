import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LecturePassDto } from '@src/common/dtos/lecture-pass.dto';

export function ApiGetLecturerPassList() {
  return applyDecorators(
    ApiOperation({
      summary: '강사 Id로 패스권 조회',
    }),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'passList',
      LecturePassDto,
      { isArray: true },
    ),
  );
}
