import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from '@src/search/services/search.service';
import { AllowUserAndGuestGuard } from '@src/common/guards/allow-user-guest.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { CombinedSearchResultDto } from '@src/search/dtos/response/combined-search-result.dto';
import { ApiGetCombinedSearchResult } from '@src/search/swagger-decorators/get-combined-search-result.decorator';
import { ApiTags } from '@nestjs/swagger';
import { GetCombinedSearchResultDto } from '@src/search/dtos/get-combined-search-result.dto';
import { GetLecturerSearchResultDto } from '@src/search/dtos/get-lecturer-search-result.dto';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { ApiSearchLecturerList } from '@src/search/swagger-decorators/search-lecturer-list.decorator';
import { EsLecturerDto } from '@src/search/dtos/response/es-lecturer.dto';
import { GetLectureSearchResultDto } from '@src/search/dtos/get-lecture-search-result.dto';
import { EsLectureDto } from '@src/search/dtos/response/es-lecture.dto';
import { ApiSearchLectureList } from '@src/search/swagger-decorators/search-lecture-list.decorator';

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

  @ApiSearchLectureList()
  @SetResponseKey('lectureList')
  @Get('/lecture')
  @UseGuards(AllowUserAndGuestGuard)
  async searchLectureList(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() dto: GetLectureSearchResultDto,
  ): Promise<EsLectureDto[]> {
    const userId: number = authorizedData?.user?.id;

    return await this.searchService.getLectureList(userId, dto);
  }
}
