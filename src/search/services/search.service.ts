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
  ILecturerSearchParams,
} from '../interface/search.interface';
import { CombinedSearchResultDto } from '../dtos/combined-search-result.dto';
import { GetCombinedSearchResultDto } from '../dtos/get-combined-search-result.dto';
import { GetLecturerSearchResultDto } from '../dtos/get-lecturer-search-result.dto';
import { LecturerSortOptions } from '../enum/search.enum';
import { EsLectureDto } from '../dtos/es-lecture.dto';
import { EsLecturerDto } from '../dtos/es-lecturer.dto';

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
    getCombinedSearchResultDto: GetCombinedSearchResultDto,
  ): Promise<CombinedSearchResultDto> {
    const searchedLecturers: IEsLecturer[] = await this.searchLecturers(
      userId,
      getCombinedSearchResultDto,
    );
    const searchedLectures: IESLecture[] = await this.searchLectures(
      userId,
      getCombinedSearchResultDto,
    );

    const slicedLecturers = searchedLecturers
      ? searchedLecturers.slice(0, getCombinedSearchResultDto.take)
      : null;
    const slicedLectures = searchedLectures
      ? searchedLectures.slice(0, getCombinedSearchResultDto.take)
      : null;

    return new CombinedSearchResultDto({
      searchedLecturers: slicedLecturers,
      searchedLectures: slicedLectures,
    });
  }

  private async searchLecturers(
    userId: number,
    getCombinedSearchResultDto: GetCombinedSearchResultDto,
  ) {
    const { value, take } = getCombinedSearchResultDto;
    const searchedLecturers: IEsLecturer[] =
      await this.searchLecturersWithElasticsearch({ value, take });
    if (!searchedLecturers || !userId) {
      return searchedLecturers;
    }

    //유저가 차단한 강사 필터링
    const userBlockedLecturer: BlockedLecturer[] =
      await this.searchRepository.getUserblockedLecturerList(userId);
    const lecturersWithoutBlocked = searchedLecturers.filter(
      (lecturer: IEsLecturer) =>
        !userBlockedLecturer.some(
          (blocked) => blocked.lecturerId === lecturer.id,
        ),
    );

    if (!lecturersWithoutBlocked) {
      return;
    }

    //유저가 좋아요 누른 강사 조회
    const userLikedLecturerList: LikedLecturer[] =
      await this.searchRepository.getUserLikedLecturerList(userId);

    const likedLecturerIds = userLikedLecturerList.map(
      (like) => like.lecturerId,
    );

    // 좋아요한 강사들에 isLiked 속성 추가
    const lecturersWithLikeStatus = lecturersWithoutBlocked.map(
      (lecturer: IEsLecturer) => ({
        ...lecturer,
        isLiked: likedLecturerIds.includes(lecturer.id),
      }),
    );

    return lecturersWithLikeStatus;
  }

  private async searchLecturersWithElasticsearch({
    value,
    take,
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
        },
      },
      // search_after: lecturerSearchAfter,
      sort: [{ _score: { order: 'desc' } }, { updatedat: { order: 'desc' } }],
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
    getCombinedSearchResultDto: GetCombinedSearchResultDto,
  ): Promise<IESLecture[]> {
    const searchedLectures = await this.searchLecturesWithElasticsearch(
      getCombinedSearchResultDto,
    );

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
    const lecturersWithLikeStatus = lecturesWithoutBlocked.map(
      (lecture: IESLecture) => {
        return {
          ...lecture,
          isLiked: likedLectureIds.includes(lecture.id),
        };
      },
    );

    return lecturersWithLikeStatus;
  }

  private async searchLecturesWithElasticsearch({
    value,
    take,
  }: // lectureSearchAfter,
  GetCombinedSearchResultDto): Promise<IESLecture[]> {
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
        sort: [{ _score: { order: 'desc' } }, { updatedat: { order: 'desc' } }],
        // search_after: lectureSearchAfter,
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
    getLecturerSearchResultDto: GetLecturerSearchResultDto,
  ) {
    const searchedLecturers: IEsLecturer[] =
      await this.detailSearchLecturersWithElasticsearch(
        getLecturerSearchResultDto,
      );

    if (!searchedLecturers) {
      return;
    }
    if (!userId) {
      return searchedLecturers.map((lecturer) => new EsLecturerDto(lecturer));
    }

    //유저가 차단한 강사 필터링
    const userBlockedLecturer: BlockedLecturer[] =
      await this.searchRepository.getUserblockedLecturerList(userId);
    const lecturersWithoutBlocked = searchedLecturers.filter(
      (lecturer: IEsLecturer) =>
        !userBlockedLecturer.some(
          (blocked) => blocked.lecturerId === lecturer.id,
        ),
    );
    if (!lecturersWithoutBlocked) {
      return;
    }

    //유저가 좋아요 누른 강사 조회
    const userLikedLecturerList: LikedLecturer[] =
      await this.searchRepository.getUserLikedLecturerList(userId);
    const likedLecturerIds = userLikedLecturerList.map(
      (like) => like.lecturerId,
    );
    //isLiked 속성 추가
    const lecturersWithLikeStatus = lecturersWithoutBlocked.map(
      (lecturer: IEsLecturer) => ({
        ...lecturer,
        isLiked: likedLecturerIds.includes(lecturer.id),
      }),
    );

    return lecturersWithLikeStatus.map(
      (lecturer) => new EsLecturerDto(lecturer),
    );
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
    const searchQuery = this.getSearchQuery(value);
    const genreQuery = this.getGenreQuery(genres);
    const starQuery = this.getStarQuery(stars);
    const sortQuery: any[] = this.getSortQuery(sortOption);
    const regionQuery = this.getRegionQuery(regions);

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

  private getSearchQuery(value: string) {
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

  private getGenreQuery(genres: string[]) {
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

  private getStarQuery(stars: number) {
    return stars ? { range: { stars: { gte: stars } } } : undefined;
  }

  private getSortQuery(sortOption: LecturerSortOptions) {
    return sortOption === LecturerSortOptions.LATEST
      ? [{ updatedat: { order: 'desc' } }, { _score: { order: 'desc' } }]
      : [{ stars: { order: 'desc' } }, { _score: { order: 'desc' } }];
  }

  private getRegionQuery(regions: string[]) {
    let regionQuery;
    if (regions && regions.length > 0) {
      const query = regions.map((region) => {
        const [administrativeDistrict, district] = region.split(' ');

        return [
          {
            bool: {
              must: [
                {
                  match: {
                    'regions.administrativeDistrict.nori':
                      administrativeDistrict,
                  },
                },
                {
                  match: { 'regions.district.nori': district },
                },
              ],
            },
          },
        ];
      });

      regionQuery = {
        bool: {
          should: query.flat(),
        },
      };
    }
    return regionQuery;
  }
}
