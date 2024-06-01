import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EsLecturerDto } from '../dtos/response/es-lecturer.dto';
import { PaginationResponseDto } from '@src/common/swagger/dtos/pagination-response.dto';

export function ApiSearchLecturerList() {
  return applyDecorators(
    ApiOperation({
      summary: '강사 검색 회원/비회원 가능',
    }),
    ApiBearerAuth(),
    PaginationResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'lecturerList',
      EsLecturerDto,
    ),
  );
}
