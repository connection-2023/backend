import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SearchService } from '@src/search/services/search.service';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { CombinedSearchResultDto } from '@src/search/dtos/response/combined-search-result.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetCombinedSearchResultDto } from '@src/search/dtos/request/get-combined-search-result.dto';
import { GetLecturerSearchResultDto } from '@src/search/dtos/request/get-lecturer-search-result.dto';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { EsLecturerDto } from '@src/search/dtos/response/es-lecturer.dto';
import { GetLectureSearchResultDto } from '@src/search/dtos/request/get-lecture-search-result.dto';
import { EsLectureDto } from '@src/search/dtos/response/es-lecture.dto';
import { AllowUserLecturerAndGuestGuard } from '@src/common/guards/allow-user-lecturer-guest.guard';
import { GetUserId } from '@src/common/decorator/get-user-id.decorator';
import { GetUserSearchHistoryListDto } from '../dtos/request/get-user-search-history.dto';
import { AllowUserAndLecturerGuard } from '@src/common/guards/allow-user-lecturer.guard';
import { SearchHistoryDto } from '../dtos/response/search-history.dto';
import { plainToInstance } from 'class-transformer';
import { SearchPassListDto } from '../dtos/request/search-pass-list.dto';
import { EsPassDto } from '../dtos/response/es-pass.dto ';
import { PopularSearchTermDto } from '../dtos/response/popular-search-term.dto';
import { PaginatedResponse } from '@src/common/types/type';
import { ApiSearch } from './swagger/search.swagger';

@ApiTags('검색')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiSearch.GetCombinedSearchResult({ summary: '통합 검색' })
  @UseGuards(AllowUserLecturerAndGuestGuard)
  @Get()
  async getCombinedSearchResult(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() dto: GetCombinedSearchResultDto,
  ): Promise<CombinedSearchResultDto> {
    const userId: number = authorizedData?.user?.id;
    if (userId && dto.value) {
      await this.searchService.saveSearchTerm(userId, dto.value);
    }

    return await this.searchService.getCombinedSearchResult(userId, dto);
  }

  @ApiSearch.SearchLecturerList({ summary: '강사 검색' })
  @UseGuards(AllowUserLecturerAndGuestGuard)
  @Get('/lecturer')
  async searchLecturerList(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() dto: GetLecturerSearchResultDto,
  ): Promise<PaginatedResponse<EsLecturerDto, 'lecturerList'>> {
    const userId: number = authorizedData?.user?.id;
    if (userId && dto.value) {
      await this.searchService.saveSearchTerm(userId, dto.value);
    }

    return await this.searchService.getLecturerList(userId, dto);
  }

  @ApiSearch.SearchLectureList({ summary: '강의 검색' })
  @UseGuards(AllowUserLecturerAndGuestGuard)
  @Get('/lecture')
  async searchLectureList(
    @GetUserId() authorizedData: ValidateResult,
    @Query() dto: GetLectureSearchResultDto,
  ): Promise<PaginatedResponse<EsLectureDto, 'lectureList'>> {
    const userId: number = authorizedData?.user?.id;
    if (userId && dto.value) {
      await this.searchService.saveSearchTerm(userId, dto.value);
    }

    return await this.searchService.getLectureList(userId, dto);
  }

  @ApiSearch.SearchPassList({ summary: '패스권 검색' })
  @UseGuards(AllowUserLecturerAndGuestGuard)
  @Get('/pass')
  async searchPassList(
    @GetUserId() authorizedData: ValidateResult,
    @Query() dto: SearchPassListDto,
  ): Promise<PaginatedResponse<EsPassDto, 'passList'>> {
    const userId: number = authorizedData?.user?.id;
    if (userId && dto.value) {
      await this.searchService.saveSearchTerm(userId, dto.value);
    }

    return await this.searchService.getPassList(userId, dto);
  }

  @ApiSearch.GetSearchHistory({ summary: '최근 검색어 조회' })
  @SetResponseKey('searchHistoryList')
  @UseGuards(AllowUserAndLecturerGuard)
  @Get('/history')
  async getSearchHistory(
    @GetUserId() authorizedData: ValidateResult,
    @Query() getUserSearchHistoryListDto: GetUserSearchHistoryListDto,
  ): Promise<SearchHistoryDto[]> {
    return await this.searchService.getSearchHistory(
      authorizedData?.user?.id,
      getUserSearchHistoryListDto,
    );
  }

  @ApiSearch.GetPopularSearchTerms({ summary: '인기 검색어 조회' })
  @SetResponseKey('popularSearchTerms')
  @Get('/popular-terms')
  async getPopularSearchTerms(): Promise<PopularSearchTermDto[]> {
    return await this.searchService.getPopularSearchTerms();
  }

  @ApiSearch.DeleteAllSearchHistory({ summary: '최근 검색어 전체 삭제' })
  @UseGuards(AllowUserAndLecturerGuard)
  @Delete('/history')
  async deleteAllSearchHistory(
    @GetUserId() authorizedData: ValidateResult,
  ): Promise<void> {
    return await this.searchService.deleteAllSearchHistory(
      authorizedData.user.id,
    );
  }

  @ApiSearch.DeleteSingleSearchHistory({ summary: '최근 검색어 삭제' })
  @UseGuards(AllowUserAndLecturerGuard)
  @Delete('/history/:historyId')
  async deleteSingleSearchHistory(
    @GetUserId() authorizedData: ValidateResult,
    @Param('historyId', ParseIntPipe) historyId: number,
  ): Promise<void> {
    return await this.searchService.deleteSearchHistory(
      authorizedData.user.id,
      historyId,
    );
  }
}
