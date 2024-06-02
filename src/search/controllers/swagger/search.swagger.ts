import { ApiOperator } from '@src/common/types/type';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExceptionResponseDto } from '@src/common/swagger/dtos/exeption-response.dto';
import { StatusResponseDto } from '@src/common/swagger/dtos/status-response.dto';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LecturePassWithTargetDto } from '@src/common/dtos/lecture-pass-with-target.dto';
import { MyPassDto } from '@src/pass/dtos/pass.dto';
import { PassWithLecturerDto } from '@src/pass/dtos/response/pass-with-lecturer.dto';
import { IssuedPassDto } from '@src/pass/dtos/response/issued-pass.dto';
import { PaginationResponseDto } from '@src/common/swagger/dtos/pagination-response.dto';
import { SearchController } from '../search.controller';
import { GeneralResponseDto } from '@src/common/swagger/dtos/general-response.dto';
import { CombinedSearchResultDto } from '@src/search/dtos/response/combined-search-result.dto';
import { EsLecturerDto } from '@src/search/dtos/response/es-lecturer.dto';
import { EsLectureDto } from '@src/search/dtos/response/es-lecture.dto';
import { EsPassDto } from '@src/search/dtos/response/es-pass.dto ';
import { SearchHistoryDto } from '@src/search/dtos/response/search-history.dto';
import { PopularSearchTermDto } from '@src/search/dtos/response/popular-search-term.dto';

export const ApiSearch: ApiOperator<keyof SearchController> = {
  GetCombinedSearchResult: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      GeneralResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'combinedResult',
        CombinedSearchResultDto,
      ),
    );
  },

  SearchLecturerList: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'lecturerList',
        EsLecturerDto,
      ),
    );
  },

  SearchLectureList: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'lectureList',
        EsLectureDto,
      ),
    );
  },

  SearchPassList: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'passList',
        EsPassDto,
      ),
    );
  },

  GetSearchHistory: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'searchHistoryList',
        SearchHistoryDto,
        { isArray: true },
      ),
    );
  },

  GetPopularSearchTerms: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'popularSearchTerms',
        PopularSearchTermDto,
        { isArray: true },
      ),
    );
  },

  DeleteAllSearchHistory: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'deleteAllSearchHistory'),
    );
  },

  DeleteSingleSearchHistory: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'deleteSearchHistory'),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.BAD_REQUEST, [
        {
          error: 'SearchHistoryNotFound',
          description: '존재하지 않는 검색 기록입니다.',
        },
      ]),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.NOT_FOUND, [
        {
          error: 'MismatchedUser',
          description: '유저 정보가 일치하지 않습니다.',
        },
      ]),
    );
  },
};
