import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LectureInProgressDto } from '@src/lecturer/dtos/response/lecturer-lecture-in-progress.dto';

export function ApiGetLectureProgress() {
  return applyDecorators(
    ApiOperation({
      summary: '강의 진행도 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'lectureProgress',
      LectureInProgressDto,
      { isArray: true },
    ),
  );
}
