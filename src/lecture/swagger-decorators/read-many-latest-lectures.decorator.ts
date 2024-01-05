import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { GeneralResponseDto } from '@src/common/swagger/dtos/general-response.dto';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LectureDto } from '@src/common/dtos/lecture.dto';

export function ApiReadManylatestLectures() {
  return applyDecorators(
    ApiOperation({
      summary: '최신 강의 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'lectures', LectureDto, {
      isArray: true,
    }),
  );
}
