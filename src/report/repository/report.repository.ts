import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  ReportedReviewInputData,
  UserReportInputData,
} from '../interface/report.interface';
import {
  LectureReview,
  LecturerReview,
  ReportType,
  UserReport,
} from '@prisma/client';
import { ICursor } from '@src/payments/interface/payments.interface';

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

  async trxCreateUserReport(
    transaction: PrismaTransaction,
    userReportInputData: UserReportInputData,
  ): Promise<UserReport> {
    try {
      return await transaction.userReport.create({ data: userReportInputData });
    } catch (error) {
      throw new InternalServerErrorException(
        `Prisma 신고 정보 생성 실패: ${error}`,
        'PrismaCreateFailed',
      );
    }
  }

  async trxCreateUserReportedReview(
    transaction: PrismaTransaction,
    reportedReviewInputData: ReportedReviewInputData,
  ): Promise<void> {
    try {
      await transaction.userReportedReview.create({
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
    take: number,
    cursor: ICursor,
    skip: number,
  ) {
    try {
      return await this.prismaService.userReport.findMany({
        where: { reportedUserId, ...filterOption },
        take,
        cursor,
        skip,
        select: {
          id: true,
          targetUser: { select: { nickname: true } },
          targetLecturer: { select: { nickname: true } },
          reportType: { select: { description: true } },
          reason: true,
          isAnswered: true,
          createdAt: true,
          updatedAt: true,
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
}
