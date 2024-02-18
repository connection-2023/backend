import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { EsLectureDto } from '@src/search/dtos/response/es-lecture.dto';

export function ApiSearchLectureList() {
  return applyDecorators(
    ApiOperation({
      summary: '강의 검색 회원/비회원 가능',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'lectureList',
      EsLectureDto,
      { isArray: true },
    ),
  );
}
