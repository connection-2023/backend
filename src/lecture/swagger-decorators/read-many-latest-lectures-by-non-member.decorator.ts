import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LectureDto } from '@src/common/dtos/lecture.dto';

export function ApiReadManylatestLecturesByNonMember() {
  return applyDecorators(
    ApiOperation({
      summary: '비회원용 최신 강의 조회',
    }),
    DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'lectures', LectureDto, {
      isArray: true,
    }),
  );
}
