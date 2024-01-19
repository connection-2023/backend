import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LectureDto } from '@src/common/dtos/lecture.dto';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';

export function ApiReadManyLectureWithLecturer() {
  return applyDecorators(
    ApiOperation({
      summary: '토큰 강사 id로 강의 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'lecture', LectureDto, {
      isArray: true,
    }),
  );
}
