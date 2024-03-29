import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { EsLecturerDto } from '../dtos/response/es-lecturer.dto';

export function ApiSearchLecturerList() {
  return applyDecorators(
    ApiOperation({
      summary: '강사 검색 회원/비회원 가능',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'lecturerList',
      EsLecturerDto,
      { isArray: true },
    ),
  );
}
