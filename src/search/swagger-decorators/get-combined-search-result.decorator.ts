import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GeneralResponseDto } from '@src/common/swagger/dtos/general-response.dto';
import { CombinedSearchResultDto } from '../dtos/combined-search-result.dto';

export function ApiGetCombinedSearchResult() {
  return applyDecorators(
    ApiOperation({
      summary: '통합 검색 회원/비회원 가능',
    }),
    ApiBearerAuth(),
    GeneralResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'combinedResult',
      CombinedSearchResultDto,
    ),
  );
}
