import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { GeneralResponseDto } from '@src/common/swagger/dtos/general-response.dto';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LectureDto } from '@src/common/dtos/lecture.dto';

export function ApiReadManyPopularLecturesByNonMember() {
  return applyDecorators(
    ApiOperation({
      summary: '비회원용 인기 강의 조회',
    }),
    DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'lectures', LectureDto, {
      isArray: true,
    }),
  );
}
