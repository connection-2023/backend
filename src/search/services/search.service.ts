import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PrismaService } from '@src/prisma/prisma.service';
import { SearchRepository } from '@src/search/repository/search.repository';
import { BlockedLecturer, LikedLecturer } from '@prisma/client';

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

  async getCombinedSearchResult(userId, value) {
    const searchedLecturers = await this.searchLecturers(userId, value);
    const searchedLectures = await this.searchLectures(userId, value);

    return { searchedLecturers, searchedLectures };
  }

  private async searchLecturers(userId: number, value: string) {
    const searchedLecturers = await this.searchLecturersWithElasticsearch(
      value,
    );
    if (!searchedLecturers || !userId) {
      return searchedLecturers;
    }

    const userBlockedLecturer =
      await this.searchRepository.getUserblockedLecturerList(userId);
    const lecturersWithoutBlocked = searchedLecturers.filter(
      (lecturer: BlockedLecturer) =>
        !userBlockedLecturer.some(
          (blocked) => blocked.lecturerId === lecturer.id,
        ),
    );

    if (!lecturersWithoutBlocked) {
      return;
    }

    const userLikedLecturerList: LikedLecturer[] =
      await this.searchRepository.getUserLikedLecturerList(userId);

    const likedLecturerIds = userLikedLecturerList.map(
      (like) => like.lecturerId,
    );

    // 좋아요한 강사들에 isLiked 속성 추가
    const lecturersWithLikeStatus = lecturersWithoutBlocked.map(
      (lecturer: LikedLecturer) => ({
        ...lecturer,
        isLiked: likedLecturerIds.includes(lecturer.id),
      }),
    );

    return lecturersWithLikeStatus;
  }

  private async searchLecturersWithElasticsearch(value: string) {
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
    });

    if (typeof hits.total === 'object' && hits.total.value > 0) {
      return hits.hits.map((hit) => hit._source);
    }
  }

  /**
   *
   * @todo 차단, 좋아요 구현
   */
  private async searchLectures(userId, value) {
    const searchedLectures = await this.searchLecturesWithElasticsearch(value);

    return searchedLectures;
  }

  private async searchLecturesWithElasticsearch(value: string) {
    const { hits } = await this.esService.search({
      index: 'lecture',
      // size: 1,
      // from: 25,
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
    });

    if (typeof hits.total === 'object' && hits.total.value > 0) {
      return hits.hits.map((hit) => hit._source);
    }
  }
}
