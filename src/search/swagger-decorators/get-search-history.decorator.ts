import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { SearchHistoryDto } from '../dtos/response/search-history.dto';

export function ApiGetSearchHistory() {
  return applyDecorators(
    ApiOperation({
      summary: '최근 검색어 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'searchHistoryList',
      SearchHistoryDto,
      { isArray: true },
    ),
  );
}
