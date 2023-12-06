import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { ReportResponseInputData } from '../interfaces/admin-interface';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import { date } from 'joi';
import { Tables } from 'aws-sdk/clients/honeycode';
import {
  Lecturer,
  LecturerReport,
  LecturerReportResponse,
  UserReport,
  UserReportResponse,
  Users,
} from '@prisma/client';

@Injectable()
export class AdminRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async trxCreateUserReportResponse(
    transaction: PrismaTransaction,
    reportResponseInputData: ReportResponseInputData,
  ): Promise<UserReportResponse> {
    return await transaction.userReportResponse.create({
      data: reportResponseInputData,
    });
  }

  async trxUpdateUserReportIsAnswered(
    transaction: PrismaTransaction,
    reportId: number,
  ) {
    return await transaction.userReport.update({
      where: { id: reportId },
      data: { isAnswered: true },
      include: {
        reportedUser: true,
        targetUser: { include: { userProfileImage: true } },
        targetLecturer: { include: { lecturerProfileImageUrl: true } },
        userReportResponse: { include: { admin: true } },
        userReportType: { include: { reportType: true } },
      },
    });
  }

  async getUserReportList() {
    return await this.prismaService.userReport.findMany({
      include: {
        reportedUser: true,
        userReportType: { include: { reportType: true } },
        userReportResponse: { include: { admin: true } },
        userReportedReview: true,
      },
    });
  }
}
