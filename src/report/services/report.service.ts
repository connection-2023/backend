import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReportDto } from '@src/report/dtos/create-report-dto';
import { ReportRepository } from '@src/report/repository/report.repository';
import { ReportType, UserReport } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  ICursor,
  PrismaTransaction,
  ValidateResult,
} from '@src/common/interface/common-interface';
import { ReportFilterOptions } from '@src/report/eunm/report-enum';
import {
  ReportTargetData,
  ReviewData,
} from '@src/report/interface/report.interface';
import { GetMyReportListDto } from '@src/report/dtos/get-my-report-list.dto';

@Injectable()
export class ReportService {
  constructor(
    private reportRepository: ReportRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async createReport(
    authorizedData: ValidateResult,
    {
      lectureReviewId,
      lecturerReviewId,
      reportType,
      targetUserId,
      ...reportInputData
    }: CreateReportDto,
  ): Promise<void> {
    const { reportTargetTable, reportTargetReviewTable, reportedTarget } =
      this.getReportTargetData(authorizedData);

    const reportedReviewData: ReviewData = await this.getReportedReviewData(
      targetUserId,
      lectureReviewId,
      lecturerReviewId,
    );

    const reportTypeId: number = await this.getReportTypeId(reportType);

    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const createdReport: UserReport =
          await this.reportRepository.trxCreateReport(
            transaction,
            reportTargetTable,
            {
              targetUserId,
              reportTypeId,
              ...reportedTarget,
              ...reportInputData,
            },
          );

        if (reportedReviewData) {
          await this.reportRepository.trxCreateReportedReview(
            transaction,
            reportTargetReviewTable,
            {
              reportId: createdReport.id,
              ...reportedReviewData,
            },
          );
        }
      },
    );
  }

  private getReportTargetData(
    authorizedData: ValidateResult,
  ): ReportTargetData {
    let reportTargetTable: string;
    let reportTargetReviewTable: string;
    let reportedTarget;

    if (authorizedData.user) {
      reportTargetTable = 'userReport';
      reportTargetReviewTable = 'userReportedReview';
      reportedTarget = { reportedUserId: authorizedData.user.id };
    } else {
      reportTargetTable = 'lecturerReport';
      reportTargetReviewTable = 'lecturerReportedReview';
      reportedTarget = { reportedLecturerId: authorizedData.lecturer.id };
    }

    return { reportTargetTable, reportTargetReviewTable, reportedTarget };
  }

  private async getReportTypeId(reportType: string): Promise<number> {
    const selectedReportType: ReportType =
      await this.reportRepository.getReportType(reportType);

    if (!selectedReportType) {
      throw new BadRequestException(`잘못된 신고 타입입니다.`);
    }

    return selectedReportType.id;
  }

  private async getReportedReviewData(
    targetUserId: number,
    lectureReviewId: number,
    lecturerReviewId: number,
  ): Promise<ReviewData> {
    let reviewId: number;
    let reviewerId: number;
    let reviewDescription: string;

    if (lectureReviewId) {
      const selectedLectureReview =
        await this.reportRepository.getLectureReviewDescription(
          lectureReviewId,
        );

      reviewId = selectedLectureReview?.id;
      reviewerId = selectedLectureReview?.userId;
      reviewDescription = selectedLectureReview?.description;
    } else if (lecturerReviewId) {
      const selectedLecturerReview =
        await this.reportRepository.getLecturerReviewDescription(
          lecturerReviewId,
        );

      reviewId = selectedLecturerReview?.id;
      reviewerId = selectedLecturerReview?.userId;
      reviewDescription = selectedLecturerReview?.description;
    } else {
      return;
    }

    if (!reviewId) {
      throw new NotFoundException(`리뷰가 존재하지 않습니다.`);
    }

    if (targetUserId !== reviewerId) {
      throw new BadRequestException(
        `리뷰 작성자와 신고 대상이 일치하지 않습니다.`,
      );
    }

    return {
      [lectureReviewId ? 'lectureReviewId' : 'lecturerReviewId']: reviewId,
      description: reviewDescription,
    };
  }

  async getMyReportList(
    authorizedData: ValidateResult,
    {
      filterOption,
      take,
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
    }: GetMyReportListDto,
  ) {
    const prismaFilterOption = this.getPrismaFilterOption(
      filterOption,
      authorizedData,
    );

    const { cursor, skip, updatedTake } = this.getPaginationParams(
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
      take,
    );

    return authorizedData.user
      ? await this.reportRepository.getUserReportList(
          authorizedData.user.id,
          prismaFilterOption,
          updatedTake,
          cursor,
          skip,
        )
      : await this.reportRepository.getLecturerReportList(
          authorizedData.lecturer.id,
          prismaFilterOption,
          updatedTake,
          cursor,
          skip,
        );
  }

  private getPrismaFilterOption(
    filterOption: ReportFilterOptions,
    authorizedData: ValidateResult,
  ) {
    const isUser = Boolean(authorizedData.user);

    switch (filterOption) {
      case ReportFilterOptions.REVIEW:
        return isUser
          ? { NOT: { userReportedReview: null } }
          : { NOT: { lecturerReportedReview: null } };
      case ReportFilterOptions.USER:
        return isUser
          ? { userReportedReview: null }
          : { lecturerReportedReview: null };
      default:
        return {};
    }
  }

  private getPaginationParams(
    currentPage: number,
    targetPage: number,
    firstItemId: number,
    lastItemId: number,
    take: number,
  ) {
    let cursor;
    let skip;
    let updatedTake = take;

    const isPagination = currentPage && targetPage;
    const isInfiniteScroll = lastItemId && take;

    if (isPagination) {
      const pageDiff = currentPage - targetPage;
      cursor = { id: pageDiff <= -1 ? lastItemId : firstItemId };
      skip = Math.abs(pageDiff) === 1 ? 1 : (Math.abs(pageDiff) - 1) * take + 1;
      updatedTake = pageDiff >= 1 ? -take : take;
    } else if (isInfiniteScroll) {
      cursor = { id: lastItemId };
      skip = 1;
    }

    return { cursor, skip, updatedTake };
  }
}
