import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LectureDetailDto } from '../dtos/read-lecture-detail.dto';

export function ApiReadOneLectureDetail() {
  return applyDecorators(
    ApiOperation({
      summary: '강의 상세 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'lectureDetail',
      LectureDetailDto,
    ),
  );
}
