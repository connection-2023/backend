import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { EnrollLectureListDto } from '../dtos/enroll-lecture-list.dto';
import { PaginationResponseDto } from '@src/common/swagger/dtos/pagination-response.dto';
import { CombinedEnrollLectureWithCountDto } from '../dtos/combined-enroll-lecture-with-count.dto';

export function ApiGetEnrollLectureList() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 신청한 클래스 목록 조회',
    }),
    ApiBearerAuth(),
    PaginationResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'enrollLectureList',
      EnrollLectureListDto,
    ),
  );
}
