import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PrismaService } from '@src/prisma/prisma.service';
import { SearchRepository } from '@src/search/repository/search.repository';
import {
  BlockedLecturer,
  Lecture,
  Lecturer,
  LikedLecture,
  LikedLecturer,
} from '@prisma/client';
import { ESLecture, EsLecturer } from '../interface/search.interface';
import { EsLecturerDto } from '../dtos/es-lecturer.dto';
import { CombinedSearchResultDto } from '../dtos/combined-search-result.dto';

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
    value: string,
  ): Promise<CombinedSearchResultDto> {
    const searchedLecturers: EsLecturer[] = await this.searchLecturers(
      userId,
      value,
    );
    const searchedLectures: ESLecture[] = await this.searchLectures(
      userId,
      value,
    );

    return new CombinedSearchResultDto({ searchedLecturers, searchedLectures });
  }

  private async searchLecturers(userId: number, value: string) {
    const searchedLecturers: EsLecturer[] =
      await this.searchLecturersWithElasticsearch(value);
    if (!searchedLecturers || !userId) {
      return searchedLecturers;
    }

    //유저가 차단한 강사 필터링
    const userBlockedLecturer: BlockedLecturer[] =
      await this.searchRepository.getUserblockedLecturerList(userId);
    const lecturersWithoutBlocked = searchedLecturers.filter(
      (lecturer: EsLecturer) =>
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
      (lecturer: EsLecturer) => ({
        ...lecturer,
        isLiked: likedLecturerIds.includes(lecturer.id),
      }),
    );

    return lecturersWithLikeStatus;
  }

  private async searchLecturersWithElasticsearch(
    value: string,
  ): Promise<EsLecturer[]> {
    const { hits } = await this.esService.search({
      index: 'lecturer',
      query: {
        bool: {
          should: [
            { match: { 'genres.genre': value } },
            { match: { nickname: value } },
            { match: { affiliation: value } },
            { match: { 'regions.administrativeDistrict': value } },
            { match: { 'regions.district': value } },
          ],
        },
      },
      sort: [
        {
          id: {
            order: 'desc',
          },
        },
      ],
    });

    if (typeof hits.total === 'object' && hits.total.value > 0) {
      return hits.hits.map((hit: any): EsLecturer => hit._source);
    }
  }

  private async searchLectures(
    userId: number,
    value: string,
  ): Promise<ESLecture[]> {
    const searchedLectures = await this.searchLecturesWithElasticsearch(value);

    if (!searchedLectures || !userId) {
      return searchedLectures;
    }

    const userBlockedLecturer: BlockedLecturer[] =
      await this.searchRepository.getUserblockedLecturerList(userId);

    //차단한 강사 필터링
    const lecturesWithoutBlocked = searchedLectures.filter(
      (lecture: ESLecture) =>
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
      (lecture: ESLecture) => {
        return {
          ...lecture,
          isLiked: likedLectureIds.includes(lecture.id),
        };
      },
    );

    return lecturersWithLikeStatus;
  }

  private async searchLecturesWithElasticsearch(
    value: string,
  ): Promise<ESLecture[]> {
    try {
      const { hits } = await this.esService.search({
        index: 'lecture',
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
        sort: [
          {
            id: {
              order: 'desc',
            },
          },
        ],
      });

      if (typeof hits.total === 'object' && hits.total.value > 0) {
        return hits.hits.map((hit: any): ESLecture => hit._source);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `검색 서버 에러 ${error}`,
        'ElasticSearchServer',
      );
    }
  }
}
