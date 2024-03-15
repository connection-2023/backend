import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { PopularSearchTermDto } from '../dtos/response/popular-search-term.dto';

export function ApiGetPopularSearchTerms() {
  return applyDecorators(
    ApiOperation({
      summary: '인기 검색어 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'popularSearchTerms',
      PopularSearchTermDto,
      { isArray: true },
    ),
  );
}
