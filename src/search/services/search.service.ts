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
  IBlockedLecturerIdQuery,
  IBlockedLecturerQuery,
  IEsLecture,
  IEsLecturer,
  IEsPass,
  IIdQuery,
  ILectureSearchParams,
  ILecturerSearchParams,
  IPassSearchParams,
} from '@src/search/interface/search.interface';
import { CombinedSearchResultDto } from '@src/search/dtos/response/combined-search-result.dto';
import { GetCombinedSearchResultDto } from '@src/search/dtos/get-combined-search-result.dto';
import { GetLecturerSearchResultDto } from '@src/search/dtos/get-lecturer-search-result.dto';
import {
  LecturerSortOptions,
  SearchTypes,
  TimeOfDay,
} from '@src/search/enum/search.enum';
import { EsLectureDto } from '@src/search/dtos/response/es-lecture.dto';
import { EsLecturerDto } from '@src/search/dtos/response/es-lecturer.dto';
import {
  DanceCategory,
  DanceMethod,
  TemporaryWeek,
  Week,
} from '@src/common/enum/enum';
import { GetLectureSearchResultDto } from '@src/search/dtos/get-lecture-search-result.dto';
import { LectureMethod } from '@src/payments/enum/payment.enum';

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
    const { idQueries, lecturerIdQueries } = await this.getBlockedLecturerIds(
      userId,
    );

    const searchedLecturers: IEsLecturer[] = await this.searchLecturers(
      userId,
      dto,
      idQueries,
    );
    const searchedLectures: IEsLecture[] = await this.searchLectures(
      userId,
      dto,
      lecturerIdQueries,
    );
    const searchedPasses: IEsPass[] = await this.searchPasses(
      dto,
      lecturerIdQueries,
    );

    return new CombinedSearchResultDto({
      searchedLecturers,
      searchedLectures,
      searchedPasses,
    });
  }

  private async searchLecturers(
    userId: number,
    { value, take }: GetCombinedSearchResultDto,
    idQueries: IIdQuery[],
  ): Promise<IEsLecturer[]> {
    const searchedLecturers = await this.searchLecturersWithElasticsearch({
      value,
      take,
      idQueries,
    });

    if (!searchedLecturers || !userId) {
      return searchedLecturers;
    }

    //isLiked 속성 추가
    const lecturersWithLikeStatus: IEsLecturer[] =
      await this.addLecturerLikeStatus(userId, searchedLecturers);

    return lecturersWithLikeStatus;
  }

  private async filterBlockedLecturersInEsLecturer(
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

  private async getBlockedLecturerIds(
    userId: number,
  ): Promise<IBlockedLecturerQuery> {
    const blockedLecturer =
      await this.searchRepository.getUserblockedLecturerList(userId);

    return blockedLecturer.reduce(
      (acc: IBlockedLecturerQuery, blockedInfo) => {
        acc.idQueries.push({ term: { id: blockedInfo.lecturerId } });
        acc.lecturerIdQueries.push({
          term: { ['lecturer.lecturerId']: blockedInfo.lecturerId },
        });
        return acc;
      },
      { idQueries: [], lecturerIdQueries: [] },
    );
  }

  private async addLecturerLikeStatus(
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
    idQueries,
  }: ILecturerSearchParams): Promise<IEsLecturer[]> {
    const { hits } = await this.esService.search({
      index: 'lecturer',
      size: take,
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
          must_not: idQueries,
        },
      },
      sort: [{ updatedat: { order: 'desc' } }, { _score: { order: 'desc' } }],
      // search_after: lecturerSearchAfter,
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
    { value, take }: GetCombinedSearchResultDto,
    lecturerIdQueries: IBlockedLecturerIdQuery[],
  ): Promise<IEsLecture[]> {
    const searchedLectures = await this.searchLecturesWithElasticsearch({
      value,
      take,
      lecturerIdQueries,
    });

    if (!searchedLectures || !userId) {
      return searchedLectures;
    }

    //isLiked 속성 추가
    const lecturesWithLikeStatus: IEsLecture[] =
      await this.addLectureLikeStatus(userId, searchedLectures);

    return lecturesWithLikeStatus;
  }

  private async searchLecturesWithElasticsearch({
    value,
    take,
    lecturerIdQueries,
  }: ILectureSearchParams): Promise<IEsLecture[]> {
    try {
      const { hits } = await this.esService.search({
        index: 'lecture',
        size: take,
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
            must_not: lecturerIdQueries,
          },
        },
        sort: [{ updatedat: { order: 'desc' } }, { _score: { order: 'desc' } }],
      });

      if (typeof hits.total === 'object' && hits.total.value > 0) {
        return hits.hits.map(
          (hit: any): IEsLecture => ({
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

  private async searchPasses(
    { value, take }: GetCombinedSearchResultDto,
    lecturerIdQueries: IBlockedLecturerIdQuery[],
  ): Promise<IEsPass[]> {
    return await this.searchPassesWithElasticsearch({
      value,
      take,
      lecturerIdQueries,
    });
  }

  private async searchPassesWithElasticsearch({
    value,
    take,
    lecturerIdQueries,
  }: IPassSearchParams): Promise<IEsPass[]> {
    const { hits } = await this.esService.search({
      index: 'lecture_pass',
      size: take,
      query: {
        bool: {
          should: [
            { match: { 'title.nori': value } },
            { match: { 'title.ngram': value } },
            { match: { 'lecturer.nickname.nori': value } },
            { match: { 'lecturer.nickname.ngram': value } },
            { match: { 'lecture.title.nori': value } },
            { match: { 'lecture.title.ngram': value } },
          ],
          must_not: lecturerIdQueries,
        },
      },
      sort: [{ updatedat: { order: 'desc' } }, { _score: { order: 'desc' } }],
    });

    if (typeof hits.total === 'object' && hits.total.value > 0) {
      return hits.hits.map(
        (hit: any): IEsPass => ({
          ...hit._source,
          searchAfter: hit.sort,
        }),
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
      await this.filterBlockedLecturersInEsLecturer(userId, searchedLecturers);
    if (!lecturersWithoutBlocked) {
      return;
    }

    //isLiked 속성 추가
    const lecturersWithLikeStatus: IEsLecturer[] =
      await this.addLecturerLikeStatus(userId, lecturersWithoutBlocked);

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
      : [
          { stars: { order: 'desc' } },
          { updatedat: { order: 'desc' } },
          { _score: { order: 'desc' } },
        ];
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
          district === '전' || administrativeDistrict === '온라인'
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

  async getLectureList(
    userId: number,
    dto: GetLectureSearchResultDto,
  ): Promise<EsLectureDto[]> {
    const searchedLectures: IEsLecture[] =
      await this.detailSearchLecturesWithElasticsearch(dto);
    if (!searchedLectures) {
      return;
    }

    //지정 날짜 필터링
    const filteredLectures: IEsLecture[] = await this.filterLecturesByDate(
      searchedLectures,
      dto,
    );
    if (!filteredLectures) {
      return;
    }

    if (!userId) {
      const slicedLectures = this.sliceResults(filteredLectures, dto.take);

      return slicedLectures.map((lecture) => new EsLectureDto(lecture));
    }

    //차단한 강사의 강의 제외
    const lecturesWithoutBlocked: IEsLecture[] =
      await this.filterBlockedLecturersInEsLecture(userId, filteredLectures);
    if (!lecturesWithoutBlocked) {
      return;
    }

    //isLiked 속성 추가
    const lecturesWithLikeStatus: IEsLecture[] =
      await this.addLectureLikeStatus(userId, lecturesWithoutBlocked);

    //검색결과 개수를 맞추기 위한 slice
    const slicedLectures = this.sliceResults(lecturesWithLikeStatus, dto.take);

    return slicedLectures.map((lecture) => new EsLectureDto(lecture));
  }

  private async detailSearchLecturesWithElasticsearch({
    value,
    take,
    timeOfDay,
    stars,
    regions,
    genres,
    gtePrice,
    ltePrice,
    lectureMethod,
    isGroup,
    sortOption,
    searchAfter,
  }: ILectureSearchParams): Promise<IEsLecture[]> {
    const sortQuery: any[] = this.buildSortQuery(sortOption);
    const isGroupQuery = this.buildIsGroupQuery(isGroup);
    const searchQuery = this.buildSearchQuery(SearchTypes.LECTURE, value);
    const timeQuery = this.buildTimeQuery(timeOfDay);
    const starQuery = this.buildStarQuery(stars);
    const regionQuery = this.buildRegionQuery(regions);
    const genreQuery = this.buildGenreQuery(genres);
    const priceQuery = this.buildPriceQuery(ltePrice, gtePrice);
    const methodQuery = this.buildMethodQuery(lectureMethod);

    const { hits } = await this.esService.search({
      index: 'lecture',
      size: take * 2,
      query: {
        bool: {
          must: [
            searchQuery,
            timeQuery,
            starQuery,
            regionQuery,
            genreQuery,
            priceQuery,
            methodQuery,
            isGroupQuery,
          ].filter(Boolean),
        },
      },
      search_after: searchAfter,
      sort: sortQuery,
    });

    if (typeof hits.total === 'object' && hits.total.value > 0) {
      return hits.hits.map(
        (hit: any): IEsLecture => ({
          ...hit._source,
          searchAfter: hit.sort,
        }),
      );
    }
  }

  private buildTimeQuery(times: TimeOfDay[]) {
    if (!times) {
      return false;
    }

    const timeRanges = times.map((time) => {
      switch (time) {
        case TimeOfDay.MORNING:
          return {
            range: {
              'days.dateTime': {
                gte: '06:00:00',
                lte: '11:59:59',
              },
            },
          };
        case TimeOfDay.AFTERNOON:
          return {
            range: {
              'days.dateTime': {
                gte: '12:00:00',
                lte: '17:59:59',
              },
            },
          };
        case TimeOfDay.NIGHT:
          return {
            range: {
              'days.dateTime': {
                gte: '18:00:00',
                lte: '23:59:59',
              },
            },
          };
        case TimeOfDay.DAWN:
          return {
            range: {
              'days.dateTime': {
                gte: '00:00:00',
                lte: '05:59:59',
              },
            },
          };
      }
    });

    const timeQuery =
      timeRanges.length > 0
        ? {
            bool: {
              should: timeRanges,
            },
          }
        : undefined;

    return timeQuery;
  }

  private buildPriceQuery(ltePrice?: number, gtePrice?: number) {
    if (ltePrice === undefined && gtePrice === undefined) {
      return undefined;
    }

    return {
      bool: {
        should: { range: { price: { gte: gtePrice, lte: ltePrice } } },
      },
    };
  }

  private buildMethodQuery(method: DanceMethod) {
    return method
      ? {
          bool: {
            should: { match: { lecturemethod: method } },
          },
        }
      : undefined;
  }

  private buildIsGroupQuery(isGroup: Boolean) {
    return {
      bool: {
        should: { match: { isgroup: isGroup } },
      },
    };
  }

  private async filterBlockedLecturersInEsLecture(
    userId: number,
    lectures: IEsLecture[],
  ): Promise<IEsLecture[]> {
    const userBlockedLecturer: BlockedLecturer[] =
      await this.searchRepository.getUserblockedLecturerList(userId);

    //차단한 강사 필터링
    const lecturesWithoutBlocked = lectures.filter(
      (lecture: IEsLecture) =>
        !userBlockedLecturer.some(
          (blocked) => blocked.lecturerId === lecture.lecturer.lecturerId,
        ),
    );

    return lecturesWithoutBlocked;
  }

  private async addLectureLikeStatus(
    userId: number,
    lectures: IEsLecture[],
  ): Promise<IEsLecture[]> {
    const userLikedLectureList: LikedLecture[] =
      await this.searchRepository.getUserLikedLectureList(userId);

    const likedLectureIds = userLikedLectureList.map((like) => like.lectureId);

    // 좋아요한 강의들에 isLiked 속성 추가
    const lecturesWithLikeStatus = lectures.map((lecture: IEsLecture) => {
      return {
        ...lecture,
        isLiked: likedLectureIds.includes(lecture.id),
      };
    });

    return lecturesWithLikeStatus;
  }

  private async filterLecturesByDate(
    lectures: IEsLecture[],
    { lteDate, gteDate, days }: GetLectureSearchResultDto,
  ): Promise<IEsLecture[]> {
    if (!lteDate && !gteDate && !days) {
      return lectures;
    }
    const convertedDays = days?.map((day) => Week[day as keyof typeof Week]);

    const formattedGteDate = gteDate
      ? new Date(gteDate.setHours(9, 0, 0, 0))
      : undefined;

    const formattedLteDate =
      gteDate && lteDate
        ? new Date(lteDate.setHours(32, 59, 59, 999))
        : gteDate
        ? new Date(gteDate.setHours(32, 59, 59, 999))
        : undefined;

    const selectedLectures = await Promise.all(
      lectures.map(async (lecture) => {
        if (lecture.lecturemethod === '원데이') {
          return await this.searchRepository.getLecturesByDate(
            lecture.id,
            formattedGteDate,
            formattedLteDate,
            convertedDays,
          );
        }

        if (lecture.lecturemethod === '정기') {
          return await this.searchRepository.getRegularLecturesByDate(
            lecture.id,
            formattedGteDate,
            formattedLteDate,
            days,
          );
        }
      }),
    );

    return lectures.filter((lecture) =>
      selectedLectures.some(
        (selectedLecture) => selectedLecture?.lectureId === lecture.id,
      ),
    );
  }
}
