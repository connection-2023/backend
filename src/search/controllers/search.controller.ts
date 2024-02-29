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
import { ApiGetCombinedSearchResult } from '@src/search/swagger-decorators/get-combined-search-result.decorator';
import { ApiTags } from '@nestjs/swagger';
import { GetCombinedSearchResultDto } from '@src/search/dtos/request/get-combined-search-result.dto';
import { GetLecturerSearchResultDto } from '@src/search/dtos/request/get-lecturer-search-result.dto';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { ApiSearchLecturerList } from '@src/search/swagger-decorators/search-lecturer-list.decorator';
import { EsLecturerDto } from '@src/search/dtos/response/es-lecturer.dto';
import { GetLectureSearchResultDto } from '@src/search/dtos/request/get-lecture-search-result.dto';
import { EsLectureDto } from '@src/search/dtos/response/es-lecture.dto';
import { ApiSearchLectureList } from '@src/search/swagger-decorators/search-lecture-list.decorator';
import { AllowUserLecturerAndGuestGuard } from '@src/common/guards/allow-user-lecturer-guest.guard';
import { GetUserId } from '@src/common/decorator/get-user-id.decorator';
import { GetUserSearchHistoryListDto } from '../dtos/request/get-user-search-history.dto';
import { AllowUserAndLecturerGuard } from '@src/common/guards/allow-user-lecturer.guard';
import { SearchHistoryDto } from '../dtos/response/search-history.dto';
import { plainToInstance } from 'class-transformer';
import { ApiGetSearchHistory } from '../swagger-decorators/get-search-history.decorator';
import { ApiDeleteSearchHistory } from '../swagger-decorators/delete-search-history.decorator';
import { SearchPassListDto } from '../dtos/request/search-pass-list.dto';
import { EsPassDto } from '../dtos/response/es-pass.dto ';
import { ApiSearchPassList } from '../swagger-decorators/search-pass-list.decorator';
import { IEsPass } from '../interface/search.interface';

@ApiTags('검색')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiGetCombinedSearchResult()
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

  @ApiSearchLecturerList()
  @SetResponseKey('lecturerList')
  @UseGuards(AllowUserLecturerAndGuestGuard)
  @Get('/lecturer')
  async searchLecturerList(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() dto: GetLecturerSearchResultDto,
  ): Promise<EsLecturerDto[]> {
    const userId: number = authorizedData?.user?.id;
    if (userId && dto.value) {
      await this.searchService.saveSearchTerm(userId, dto.value);
    }

    return await this.searchService.getLecturerList(userId, dto);
  }

  @ApiSearchLectureList()
  @SetResponseKey('lectureList')
  @UseGuards(AllowUserLecturerAndGuestGuard)
  @Get('/lecture')
  async searchLectureList(
    @GetUserId() authorizedData: ValidateResult,
    @Query() dto: GetLectureSearchResultDto,
  ): Promise<EsLectureDto[]> {
    const userId: number = authorizedData?.user?.id;
    if (userId && dto.value) {
      await this.searchService.saveSearchTerm(userId, dto.value);
    }

    return await this.searchService.getLectureList(userId, dto);
  }

  @ApiSearchPassList()
  @SetResponseKey('searchedPassList')
  @UseGuards(AllowUserLecturerAndGuestGuard)
  @Get('/pass')
  async searchPassList(
    @GetUserId() authorizedData: ValidateResult,
    @Query() dto: SearchPassListDto,
  ): Promise<EsPassDto[]> {
    const userId: number = authorizedData?.user?.id;
    if (userId && dto.value) {
      await this.searchService.saveSearchTerm(userId, dto.value);
    }

    const passList: IEsPass[] = await this.searchService.getPassList(
      userId,
      dto,
    );

    return plainToInstance(EsPassDto, passList);
  }

  @ApiGetSearchHistory()
  @SetResponseKey('searchHistoryList')
  @UseGuards(AllowUserAndLecturerGuard)
  @Get('/history')
  async getSearchHistory(
    @GetUserId() authorizedData: ValidateResult,
    @Query() getUserSearchHistoryListDto: GetUserSearchHistoryListDto,
  ): Promise<SearchHistoryDto[]> {
    const userId: number = authorizedData?.user?.id;

    const userHistory: SearchHistoryDto[] =
      await this.searchService.getSearchHistory(
        userId,
        getUserSearchHistoryListDto,
      );

    return plainToInstance(SearchHistoryDto, userHistory);
  }

  @ApiDeleteSearchHistory()
  @UseGuards(AllowUserAndLecturerGuard)
  @Delete('/history/:historyId')
  async deleteSearchHistory(
    @GetUserId() authorizedData: ValidateResult,
    @Param('historyId', ParseIntPipe) historyId: number,
  ): Promise<void> {
    return await this.searchService.deleteSearchHistory(
      authorizedData.user.id,
      historyId,
    );
  }
}
