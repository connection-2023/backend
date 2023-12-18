import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { PaginationResponseDto } from '@src/common/swagger/dtos/pagination-response.dto';
import { LecturerLearnerListDto } from '../dtos/lecturer-learner-list.dto';

export function ApiGetLecturerLearnerList() {
  return applyDecorators(
    ApiOperation({
      summary: '강사 수강생 목록 조회',
    }),
    ApiBearerAuth(),
    PaginationResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'learnerList',
      LecturerLearnerListDto,
    ),
  );
}
