import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repository/admin.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { Tables, UserType } from '@src/common/enum/enum';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import { AdminDto } from '../dtos/admin.dto';
import { CreateUserReportResponseDto } from '../dtos/create-user-report-response.dto';
import { ReportResponseDto } from '../dtos/report-response.dto';
import { UserReportDto } from '../dtos/use-report.dto';

@Injectable()
export class AdminReportService {
  constructor(
    private adminRepository: AdminRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async getUserReportList() {
    return await this.prismaService.userReport.findMany({
      include: {
        reportedUser: { select: { nickname: true } },
        userReportType: { select: { reportType: { select: { name: true } } } },
        userReportResponse: {
          select: { admin: { select: { profileImage: true, nickname: true } } },
        },
      },
    });
  }

  async createUserReportResponse(
    adminId: number,
    userType: UserType,
    createUserReportResponseDto: CreateUserReportResponseDto,
  ) {
    const a = await this.prismaService.userReport.findUnique({
      where: { id: 25 },
      include: {
        reportedUser: { include: { userProfileImage: true } },
        userReportResponse: true,
      },
    });
    return new UserReportDto({ ...a });
    // let targetResponseTable;
    // let targetReportTable;
    // if (userType === UserType.USER) {
    //   targetReportTable = Tables.UserReport;
    //   targetResponseTable = Tables.UserReportResponse;
    // } else {
    //   targetReportTable = Tables.LecturerReport;
    //   targetResponseTable = Tables.LecturerReportResponse;
    // }
    // const result = await this.prismaService.$transaction(
    //   async (transaction: PrismaTransaction) => {
    //     const reportAnswer = await this.adminRepository.trxCreateReportResponse(
    //       transaction,
    //       targetResponseTable,
    //       { adminId, ...createUserReportResponseDto },
    //     );
    //     const report = await this.adminRepository.trxUpdateReportIsAnswered(
    //       transaction,
    //       targetReportTable,
    //       createUserReportResponseDto.reportId,
    //     );
    //     return { reportAnswer, report };
    //   },
    // );
    // console.log(result);
  }
}
