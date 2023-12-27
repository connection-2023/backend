import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { PaginationResponseDto } from '@src/common/swagger/dtos/pagination-response.dto';
import { LecturerDto } from '@src/common/dtos/lecturer.dto';

export function ApiGetPopularLecturer() {
  return applyDecorators(
    ApiOperation({
      summary: '인기 강사 조회',
    }),
    ApiBearerAuth(),
    PaginationResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'popularLecturers',
      LecturerDto,
    ),
  );
}
