import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from '../services/search.service';
import { AllowUserAndGuestGuard } from '@src/common/guards/allow-user-guest.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { CombinedSearchResultDto } from '../dtos/combined-search-result.dto';
import { ApiGetCombinedSearchResult } from '../swagger-decorators/get-combined-search-result.decorator';
import { ApiTags } from '@nestjs/swagger';
import { GetCombinedSearchResultDto } from '../dtos/get-combined-search-result.dto';
import { GetLecturerSearchResultDto } from '../dtos/get-lecturer-search-result.dto';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { ApiSearchLecturerList } from '../swagger-decorators/search-lecturer-list.decorator';
import { EsLecturerDto } from '../dtos/es-lecturer.dto';
import { GetLectureSearchResultDto } from '../dtos/get-lecture-search-result.dto';

@ApiTags('검색')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiGetCombinedSearchResult()
  @Get()
  @UseGuards(AllowUserAndGuestGuard)
  async getCombinedSearchResult(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() dto: GetCombinedSearchResultDto,
  ): Promise<CombinedSearchResultDto> {
    const userId: number = authorizedData?.user?.id;

    return await this.searchService.getCombinedSearchResult(userId, dto);
  }

  @ApiSearchLecturerList()
  @SetResponseKey('lecturerList')
  @Get('/lecturer')
  @UseGuards(AllowUserAndGuestGuard)
  async searchLecturerList(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() dto: GetLecturerSearchResultDto,
  ): Promise<EsLecturerDto[]> {
    const userId: number = authorizedData?.user?.id;

    return await this.searchService.getLecturerList(userId, dto);
  }

  @Get('/lecture')
  @UseGuards(AllowUserAndGuestGuard)
  async searchLectureList(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() dto: GetLectureSearchResultDto,
  ) {
    const userId: number = authorizedData?.user?.id;

    return await this.searchService.getLectureList(userId, dto);
  }
}
