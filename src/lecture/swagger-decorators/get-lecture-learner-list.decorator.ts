import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LectureLearnerDto } from '../dtos/lecture-learner.dto';

export function ApiGetLectureLearnerList() {
  return applyDecorators(
    ApiOperation({
      summary: '강사 수강생 목록 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'learnerList',
      LectureLearnerDto,
      { isArray: true },
    ),
  );
}
