import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LectureLearnerInfoDto } from '../dtos/lecture-learner-info.dto';

export function ApiGetScheduleLearnerList() {
  return applyDecorators(
    ApiOperation({
      summary: '특정 스케쥴 수강생 목록 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'scheduleLearnerList',
      LectureLearnerInfoDto,
      { isArray: true },
    ),
  );
}
