import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PrismaService } from '@src/prisma/prisma.service';
import { SearchRepository } from '@src/search/repository/search.repository';
import { BlockedLecturer, LikedLecture, LikedLecturer } from '@prisma/client';
import {
  IESLecture,
  IEsLecturer,
  ILectureSearchParams,
  ILecturerSearchParams,
} from '../interface/search.interface';
import { CombinedSearchResultDto } from '../dtos/combined-search-result.dto';
import { GetCombinedSearchResultDto } from '../dtos/get-combined-search-result.dto';
import { GetLecturerSearchResultDto } from '../dtos/get-lecturer-search-result.dto';
import { LecturerSortOptions, SearchTypes } from '../enum/search.enum';
import { EsLectureDto } from '../dtos/es-lecture.dto';
import { EsLecturerDto } from '../dtos/es-lecturer.dto';
import { DanceCategory, Week } from '@src/common/enum/enum';
import { GetLectureSearchResultDto } from '../dtos/get-lecture-search-result.dto';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly esService: ElasticsearchService,
    private readonly searchRepository: SearchRepository,
  ) {
    this.logger.log('SearchService Init');
  }

  async getCombinedSearchResult(
    userId: number,
    dto: GetCombinedSearchResultDto,
  ): Promise<CombinedSearchResultDto> {
    const searchedLecturers: IEsLecturer[] = await this.searchLecturers(
      userId,
      dto,
    );
    const searchedLectures: IESLecture[] = await this.searchLectures(
      userId,
      dto,
    );

    const slicedLecturers = this.sliceResults(searchedLecturers, dto.take);
    const slicedLectures = this.sliceResults(searchedLectures, dto.take);

    return new CombinedSearchResultDto({
      searchedLecturers: slicedLecturers,
      searchedLectures: slicedLectures,
    });
  }

  private async searchLecturers(
    userId: number,
    dto: GetCombinedSearchResultDto,
  ): Promise<IEsLecturer[]> {
    const { value, take } = dto;
    const searchedLecturers = await this.searchLecturersWithElasticsearch({
      value,
      take,
    });

    if (!searchedLecturers || !userId) {
      return searchedLecturers;
    }

    //차단한 강사 제외
    const lecturersWithoutBlocked: IEsLecturer[] =
      await this.filterBlockedLecturers(userId, searchedLecturers);
    if (!lecturersWithoutBlocked) {
      return;
    }

    //isLiked 속성 추가
    const lecturersWithLikeStatus: IEsLecturer[] = await this.addLikeStatus(
      userId,
      lecturersWithoutBlocked,
    );

    //검색결과 개수를 맞추기 위한 slice
    return lecturersWithLikeStatus;
  }

  private async filterBlockedLecturers(
    userId: number,
    lecturers: IEsLecturer[],
  ): Promise<IEsLecturer[]> {
    const userBlockedLecturer: BlockedLecturer[] =
      await this.searchRepository.getUserblockedLecturerList(userId);

    // 유저가 차단한 강사 필터링
    const lecturersWithoutBlocked = lecturers.filter(
      (lecturer: IEsLecturer) =>
        !userBlockedLecturer.some(
          (blocked) => blocked.lecturerId === lecturer.id,
        ),
    );

    return lecturersWithoutBlocked;
  }

  private async addLikeStatus(
    userId: number,
    lecturers: IEsLecturer[],
  ): Promise<IEsLecturer[]> {
    const userLikedLecturerList: LikedLecturer[] =
      await this.searchRepository.getUserLikedLecturerList(userId);
    const likedLecturerIds = userLikedLecturerList.map(
      (like) => like.lecturerId,
    );

    // 좋아요한 강사들에 isLiked 속성 추가
    const lecturersWithLikeStatus = lecturers.map((lecturer: IEsLecturer) => ({
      ...lecturer,
      isLiked: likedLecturerIds.includes(lecturer.id),
    }));

    return lecturersWithLikeStatus;
  }

  private async searchLecturersWithElasticsearch({
    value,
    take,
  }: ILecturerSearchParams): Promise<IEsLecturer[]> {
    const { hits } = await this.esService.search({
      index: 'lecturer',
      size: take * 2,
      query: {
        bool: {
          should: [
            { match: { 'nickname.nori': value } },
            { match: { 'nickname.ngram': value } },
            { match: { 'affiliation.nori': value } },
            { match: { 'affiliation.ngram': value } },
            { match: { 'genres.genre.nori': value } },
            { match: { 'genres.genre.ngram': value } },
            { match: { 'regions.administrativeDistrict.nori': value } },
            { match: { 'regions.administrativeDistrict.ngram': value } },
            { match: { 'regions.district.nori': value } },
            { match: { 'regions.district.ngram': value } },
          ],
        },
      },
      // search_after: lecturerSearchAfter,
      sort: [{ updatedat: { order: 'desc' } }, { _score: { order: 'desc' } }],
    });

    if (typeof hits.total === 'object' && hits.total.value > 0) {
      return hits.hits.map(
        (hit: any): IEsLecturer => ({
          ...hit._source,
          searchAfter: hit.sort,
        }),
      );
    }
  }

  private async searchLectures(
    userId: number,
    dto: GetCombinedSearchResultDto,
  ): Promise<IESLecture[]> {
    const searchedLectures = await this.searchLecturesWithElasticsearch(dto);

    if (!searchedLectures || !userId) {
      return searchedLectures;
    }

    const userBlockedLecturer: BlockedLecturer[] =
      await this.searchRepository.getUserblockedLecturerList(userId);

    //차단한 강사 필터링
    const lecturesWithoutBlocked = searchedLectures.filter(
      (lecture: IESLecture) =>
        !userBlockedLecturer.some(
          (blocked) => blocked.lecturerId === lecture.lecturer.lecturerId,
        ),
    );

    if (!lecturesWithoutBlocked) {
      return;
    }

    const userLikedLectureList: LikedLecture[] =
      await this.searchRepository.getUserLikedLectureList(userId);

    const likedLectureIds = userLikedLectureList.map((like) => like.lectureId);

    // 좋아요한 강의들에 isLiked 속성 추가
    const lecturesWithLikeStatus = lecturesWithoutBlocked.map(
      (lecture: IESLecture) => {
        return {
          ...lecture,
          isLiked: likedLectureIds.includes(lecture.id),
        };
      },
    );

    return lecturesWithLikeStatus;
  }

  private async searchLecturesWithElasticsearch({
    value,
    take,
  }: GetCombinedSearchResultDto): Promise<IESLecture[]> {
    try {
      const { hits } = await this.esService.search({
        index: 'lecture',
        size: take * 2,
        query: {
          bool: {
            should: [
              { match: { 'title.nori': value } },
              { match: { 'title.ngram': value } },
              { match: { 'genres.genre.nori': value } },
              { match: { 'genres.genre.ngram': value } },
              { match: { 'regions.administrativeDistrict.nori': value } },
              { match: { 'regions.administrativeDistrict.ngram': value } },
              { match: { 'regions.district.nori': value } },
              { match: { 'regions.district.ngram': value } },
              { match: { 'lecturer.nickname.nori': value } },
              { match: { 'lecturer.nickname.ngram': value } },
            ],
          },
        },
        sort: [{ updatedat: { order: 'desc' } }, { _score: { order: 'desc' } }],
      });

      if (typeof hits.total === 'object' && hits.total.value > 0) {
        return hits.hits.map(
          (hit: any): IESLecture => ({
            ...hit._source,
            searchAfter: hit.sort,
          }),
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `검색 서버 에러 ${error}`,
        'ElasticSearchServer',
      );
    }
  }

  async getLecturerList(
    userId: number,
    dto: GetLecturerSearchResultDto,
  ): Promise<EsLecturerDto[]> {
    const searchedLecturers: IEsLecturer[] =
      await this.detailSearchLecturersWithElasticsearch(dto);
    if (!searchedLecturers) {
      return;
    }
    if (!userId) {
      const slicedLecturers = this.sliceResults(searchedLecturers, dto.take);

      return slicedLecturers.map((lecturer) => new EsLecturerDto(lecturer));
    }

    //차단한 강사 제외
    const lecturersWithoutBlocked: IEsLecturer[] =
      await this.filterBlockedLecturers(userId, searchedLecturers);
    if (!lecturersWithoutBlocked) {
      return;
    }

    //isLiked 속성 추가
    const lecturersWithLikeStatus: IEsLecturer[] = await this.addLikeStatus(
      userId,
      lecturersWithoutBlocked,
    );

    //검색결과 개수를 맞추기 위한 slice
    const slicedLecturers = this.sliceResults(
      lecturersWithLikeStatus,
      dto.take,
    );

    return slicedLecturers.map((lecturer) => new EsLecturerDto(lecturer));
  }

  private async detailSearchLecturersWithElasticsearch({
    value,
    take,
    genres,
    regions,
    searchAfter,
    stars,
    sortOption,
  }: ILecturerSearchParams): Promise<IEsLecturer[]> {
    const searchQuery = this.buildSearchQuery(SearchTypes.LECTURER, value);
    const genreQuery = this.buildGenreQuery(genres);
    const starQuery = this.buildStarQuery(stars);
    const regionQuery = this.buildRegionQuery(regions);
    const sortQuery: any[] = this.buildSortQuery(sortOption);

    const { hits } = await this.esService.search({
      index: 'lecturer',
      size: take,
      query: {
        bool: {
          // undefined면 에러가 발생하기 떄문에 값이 있는 쿼리만 담을 수 있도록 필터링
          must: [searchQuery, genreQuery, regionQuery, starQuery].filter(
            Boolean,
          ),
        },
      },
      search_after: searchAfter,
      sort: sortQuery,
    });

    if (typeof hits.total === 'object' && hits.total.value > 0) {
      return hits.hits.map(
        (hit: any): IEsLecturer => ({
          ...hit._source,
          searchAfter: hit.sort,
        }),
      );
    }
  }

  private buildSearchQuery(searchType: SearchTypes, value: string) {
    if (searchType === SearchTypes.LECTURER) {
      return value
        ? {
            bool: {
              should: [
                { match: { 'nickname.nori': value } },
                { match: { 'nickname.ngram': value } },
                { match: { 'affiliation.nori': value } },
                { match: { 'affiliation.ngram': value } },
                { match: { 'genres.genre.nori': value } },
                { match: { 'genres.genre.ngram': value } },
                { match: { 'regions.administrativeDistrict.nori': value } },
                { match: { 'regions.administrativeDistrict.ngram': value } },
                { match: { 'regions.district.nori': value } },
                { match: { 'regions.district.ngram': value } },
              ],
            },
          }
        : undefined;
    }

    if (searchType === SearchTypes.LECTURE) {
      return value
        ? {
            bool: {
              should: [
                { match: { 'title.nori': value } },
                { match: { 'title.ngram': value } },
                { match: { 'genres.genre.nori': value } },
                { match: { 'genres.genre.ngram': value } },
                { match: { 'regions.administrativeDistrict.nori': value } },
                { match: { 'regions.administrativeDistrict.ngram': value } },
                { match: { 'regions.district.nori': value } },
                { match: { 'regions.district.ngram': value } },
                { match: { 'lecturer.nickname.nori': value } },
                { match: { 'lecturer.nickname.ngram': value } },
              ],
            },
          }
        : undefined;
    }
  }

  private buildGenreQuery(genres: DanceCategory[]) {
    let genreQuery;

    if (genres && genres.length > 0) {
      const query = genres.map((genre) => [
        {
          bool: {
            must: [{ match: { 'genres.genre.nori': genre } }],
          },
        },
      ]);

      genreQuery = {
        bool: {
          should: query.flat(),
        },
      };
    }
    return genreQuery;
  }

  private buildStarQuery(stars: number) {
    return stars ? { range: { stars: { gte: stars } } } : undefined;
  }

  private buildSortQuery(sortOption: LecturerSortOptions) {
    return sortOption === LecturerSortOptions.LATEST
      ? [{ updatedat: { order: 'desc' } }, { _score: { order: 'desc' } }]
      : [{ stars: { order: 'desc' } }, { _score: { order: 'desc' } }];
  }

  private buildRegionQuery(regions: string[]) {
    let regionQuery;

    if (regions && regions.length > 0) {
      const query = regions.map((region) => {
        const [administrativeDistrict, district] = region.split(' ');

        const administrativeDistrictQuery =
          administrativeDistrict.toLowerCase() === '온라인'
            ? { match: { 'regions.administrativeDistrict.nori': '온라인' } }
            : {
                match: {
                  'regions.administrativeDistrict.nori': administrativeDistrict,
                },
              };

        //온라인, 전 지역에 따라 districtQuery설정
        const districtQuery =
          district === '전'
            ? { match: { 'regions.district.nori': '전 지역' } }
            : administrativeDistrict === '온라인'
            ? undefined
            : { match: { 'regions.district.nori': district } };

        return {
          bool: {
            must: [administrativeDistrictQuery, districtQuery].filter(Boolean),
          },
        };
      });

      regionQuery = {
        bool: {
          should: query.flat(),
        },
      };
    }

    return regionQuery;
  }

  private sliceResults(results: any[], take: number): any[] {
    return results ? results.slice(0, take) : null;
  }

  async getLectureList(userId: number, dto: GetLectureSearchResultDto) {
    const searchedLectures = await this.detailSearchLecturesWithElasticsearch(
      dto,
    );

    return searchedLectures;
  }

  private async detailSearchLecturesWithElasticsearch({
    value,
    take,
    days,
    times,
    stars,
    regions,
    genres,
  }: ILectureSearchParams) {
    const searchQuery = this.buildSearchQuery(SearchTypes.LECTURE, value);
    const dayQuery = this.buildDayQuery(days);
    const timeQuery = this.buildTimeQuery(times);
    const starQuery = this.buildStarQuery(stars);
    const regionQuery = this.buildRegionQuery(regions);
    const genreQuery = this.buildGenreQuery(genres);

    const { hits } = await this.esService.search({
      index: 'lecture',
      size: take * 2,
      query: {
        bool: {
          must: [
            searchQuery,
            dayQuery,
            timeQuery,
            starQuery,
            regionQuery,
            genreQuery,
          ].filter(Boolean),
        },
      },
    });

    if (typeof hits.total === 'object' && hits.total.value > 0) {
      return hits.hits.map(
        (hit: any): IEsLecturer => ({
          ...hit._source,
          searchAfter: hit.sort,
        }),
      );
    }
  }

  private buildDayQuery(days: Week[]) {
    const dayQuery =
      days && days.length > 0
        ? days.map((day) => ({ match: { 'days.day': day } }))
        : undefined;

    return (
      dayQuery && {
        bool: {
          should: dayQuery,
        },
      }
    );
  }

  private buildTimeQuery(times: string[]) {
    const timeQuery =
      times && times.length > 0
        ? times.map((time) => ({ range: { 'days.dateTime': { gte: time } } }))
        : undefined;

    return (
      timeQuery && {
        bool: {
          should: timeQuery,
        },
      }
    );
  }
}
