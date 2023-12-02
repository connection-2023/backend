import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserReportDto } from '../dtos/create-user-report-dto';
import { ReportRepository } from '../repository/report.repository';
import { LectureReview, ReportType, UserReport } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import { ReportTypes } from '../eunm/report-enum';
import { ReviewData } from '../interface/report.interface';

@Injectable()
export class ReportService {
  constructor(
    private reportRepository: ReportRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async createUserReport(
    userId: number,
    {
      lectureReviewId,
      lecturerReviewId,
      reportType,
      targetUserId,
      ...reportInputData
    }: CreateUserReportDto,
  ): Promise<void> {
    const reportedReviewData: ReviewData = await this.getReportedReviewData(
      targetUserId,
      lectureReviewId,
      lecturerReviewId,
    );

    const reportTypeId: number = await this.getReportTypeId(reportType);

    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const createdReport: UserReport =
          await this.reportRepository.trxCreateUserReport(transaction, {
            reportedUserId: userId,
            targetUserId,
            reportTypeId,
            ...reportInputData,
          });

        if (reportedReviewData) {
          await this.reportRepository.trxCreateUserReportedReview(transaction, {
            reportId: createdReport.id,
            ...reportedReviewData,
          });
        }
      },
    );
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
    if (lectureReviewId) {
      const selectedLectureReview =
        await this.reportRepository.getLectureReviewDescription(
          lectureReviewId,
        );
      if (!selectedLectureReview) {
        throw new NotFoundException(`리뷰가 존재하지 않습니다.`);
      }
      if (selectedLectureReview.userId !== targetUserId) {
        throw new BadRequestException(
          `리뷰 작성자와 신고 대상이 일치하지 않습니다.`,
        );
      }

      return {
        lectureReviewId: selectedLectureReview.id,
        description: selectedLectureReview.description,
      };
    }

    if (lecturerReviewId) {
      const selectedLecturerReview =
        await this.reportRepository.getLecturerReviewDescription(
          lecturerReviewId,
        );
      if (!selectedLecturerReview) {
        throw new NotFoundException(`리뷰가 존재하지 않습니다.`);
      }
      if (selectedLecturerReview.userId !== targetUserId) {
        throw new BadRequestException(
          `리뷰 작성자와 신고 대상이 일치하지 않습니다.`,
        );
      }

      return {
        lecturerReviewId: selectedLecturerReview.id,
        description: selectedLecturerReview.description,
      };
    }
  }
}
