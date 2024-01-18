import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  IPaginationParams,
  PrismaTransaction,
} from '@src/common/interface/common-interface';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  LecturerReportInputData,
  ReportTypeInputData,
  ReportedReviewInputData,
  ReportedTarget,
  UserReportInputData,
} from '../interface/report.interface';
import {
  LectureReview,
  LecturerReport,
  LecturerReview,
  ReportType,
  UserReport,
} from '@prisma/client';

@Injectable()
export class ReportRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getLectureReviewDescription(reviewId: number): Promise<LectureReview> {
    try {
      return await this.prismaService.lectureReview.findUnique({
        where: { id: reviewId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 강의 리뷰 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async getLecturerReviewDescription(
    reviewId: number,
  ): Promise<LecturerReview> {
    try {
      return await this.prismaService.lecturerReview.findUnique({
        where: { id: reviewId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 강사 리뷰 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async getReportType(name: string): Promise<ReportType> {
    try {
      return await this.prismaService.reportType.findFirst({ where: { name } });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 신고 타입 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async trxCreateReport(
    transaction: PrismaTransaction,
    targetTable: string,
    reportInputData: UserReportInputData | LecturerReportInputData,
  ): Promise<UserReport> {
    try {
      return await transaction[targetTable].create({
        data: reportInputData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 신고 정보 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }

  async trxCreateReportedReview(
    transaction: PrismaTransaction,
    targetTable: string,
    reportedReviewInputData: ReportedReviewInputData,
  ): Promise<void> {
    try {
      await transaction[targetTable].create({
        data: reportedReviewInputData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 리뷰 신고 정보 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }

  async getUserReportList(
    reportedUserId: number,
    filterOption: object,
    { cursor, skip, take }: IPaginationParams,
  ) {
    try {
      return await this.prismaService.userReport.findMany({
        where: { reportedUserId, ...filterOption },
        take,
        cursor,
        skip,
        include: {
          reportedUser: true,
          targetUser: true,
          targetLecturer: true,
          userReportType: {
            include: { reportType: true },
          },
          userReportResponse: { include: { admin: true } },
        },
        orderBy: {
          id: 'desc',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 신고 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async getLecturerReportList(
    reportedLecturerId: number,
    filterOption: object,
    { cursor, skip, take }: IPaginationParams,
  ) {
    try {
      return await this.prismaService.lecturerReport.findMany({
        where: { reportedLecturerId, ...filterOption },
        take,
        cursor,
        skip,
        include: {
          reportedLecturer: true,
          targetUser: true,
          targetLecturer: true,
          lecturerReportType: {
            include: { reportType: true },
          },
          lecturerReportResponse: { include: { admin: true } },
        },
        orderBy: {
          id: 'desc',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 신고 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }

  async trxCreateReportType(
    transaction: PrismaTransaction,
    reportTargetTypeTable: string,
    reportTypeInputData: ReportTypeInputData[],
  ) {
    try {
      await transaction[reportTargetTypeTable].createMany({
        data: reportTypeInputData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 신고 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }

  async getExistReport(
    targetTable: string,
    reportedTarget: ReportedTarget,
    targetUserId: number,
    targetLecturerId: number,
  ): Promise<UserReport | LecturerReport> {
    try {
      return await this.prismaService[targetTable].findFirst({
        where: {
          ...reportedTarget,
          isAnswered: false,
          targetUserId,
          targetLecturerId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 신고 조회 실패: ${error}`,
        'PrismaFindFailed',
      );
    }
  }
}
