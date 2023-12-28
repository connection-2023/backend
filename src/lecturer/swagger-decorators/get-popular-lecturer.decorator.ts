import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { LecturerDto } from '@src/common/dtos/lecturer.dto';
import { GeneralResponseDto } from '@src/common/swagger/dtos/general-response.dto';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';

export function ApiGetPopularLecturer() {
  return applyDecorators(
    ApiOperation({
      summary: '인기 강사 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'lecturers', LecturerDto),
  );
}
