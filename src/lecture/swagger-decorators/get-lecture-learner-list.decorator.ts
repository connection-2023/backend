import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LectureLearnerDto } from '../dtos/lecture-learner.dto';

export function ApiGetLectureLearnerList() {
  return applyDecorators(
    ApiOperation({
      summary: '강의 수강생 목록 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'lectureLearnerList',
      LectureLearnerDto,
      { isArray: true },
    ),
  );
}
