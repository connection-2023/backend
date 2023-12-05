import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { ReportResponseInputData } from '../interfaces/admin-interface';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import { date } from 'joi';
import { Tables } from 'aws-sdk/clients/honeycode';
import { LecturerReportResponse, UserReportResponse } from '@prisma/client';

@Injectable()
export class AdminRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async trxCreateReportResponse(
    transaction: PrismaTransaction,
    targetResponseTable: string,
    reportResponseInputData: ReportResponseInputData,
  ): Promise<UserReportResponse | LecturerReportResponse> {
    return await transaction[targetResponseTable].create({
      data: reportResponseInputData,
    });
  }

  async trxUpdateReportIsAnswered(
    transaction: PrismaTransaction,
    targetReportTable: string,
    reportId: number,
  ) {
    return await transaction[targetReportTable].update({
      where: { id: reportId },
      data: { isAnswered: true },
    });
  }
}
