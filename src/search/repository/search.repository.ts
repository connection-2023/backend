import { Injectable } from '@nestjs/common';
import { SearchHistory } from '@prisma/client';
import { TemporaryWeek, Week } from '@src/common/enum/enum';
import {
  IPaginationParams,
  PrismaTransaction,
} from '@src/common/interface/common-interface';
import { PrismaService } from '@src/prisma/prisma.service';
import { IEsLecture } from '@src/search/interface/search.interface';

@Injectable()
export class SearchRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserLikedLecturerList(userId: number) {
    return await this.prismaService.likedLecturer.findMany({
      where: { userId },
    });
  }

  async getUserblockedLecturerList(userId: number) {
    return await this.prismaService.blockedLecturer.findMany({
      where: { userId },
    });
  }

  async getUserLikedLectureList(userId: number) {
    return await this.prismaService.likedLecture.findMany({
      where: { userId },
    });
  }

  async getLecturesByDate(
    lectureId: number,
    gteDate: Date,
    lteDate?: Date,
    days?: Week[],
  ) {
    return await this.prismaService.lectureSchedule.findFirst({
      where: {
        lectureId,
        startDateTime: {
          gte: gteDate,
          lte: lteDate,
        },
        day: { in: days },
      },
      select: {
        lectureId: true,
      },
    });
  }

  async getRegularLecturesByDate(
    lectureId: number,
    gteDate: Date,
    lteDate?: Date,
    days?: TemporaryWeek[],
  ) {
    return await this.prismaService.regularLectureStatus.findFirst({
      where: {
        lectureId,
        regularLectureSchedule: {
          some: {
            startDateTime: {
              gte: gteDate,
              lte: lteDate,
            },
          },
        },
        day: { hasSome: days },
      },
      select: {
        lectureId: true,
      },
    });
  }

  async getUserSearchHistory(
    userId: number,
    searchTerm: string,
  ): Promise<SearchHistory> {
    return await this.prismaService.searchHistory.findFirst({
      where: { userId, searchTerm },
    });
  }

  async updateUserSearchHistory(
    searchHistoryId: number,
    searchTerm: string,
  ): Promise<void> {
    await this.prismaService.searchHistory.update({
      where: { id: searchHistoryId },
      data: { searchTerm },
    });
  }

  async trxCreateSearchHistory(
    transaction: PrismaTransaction,
    userId: number,
    searchTerm: string,
  ): Promise<SearchHistory> {
    return await transaction.searchHistory.create({
      data: { userId, searchTerm },
    });
  }

  async trxUpsertPopularSearch(
    transaction: PrismaTransaction,
    searchTerm: string,
  ) {
    await transaction.popularSearch.upsert({
      where: { searchTerm },
      update: {
        searchCount: {
          increment: 1,
        },
      },
      create: { searchTerm },
    });
  }

  async getUserSearchHistoryList(
    userId: number,
    { cursor, skip, take }: IPaginationParams,
  ) {
    return this.prismaService.searchHistory.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      cursor,
      skip,
      take,
    });
  }
}
