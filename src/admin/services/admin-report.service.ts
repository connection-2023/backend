import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repository/admin.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import { CreateUserReportResponseDto } from '../dtos/create-user-report-response.dto';
import { UserReportDto } from '@src/common/dtos/use-report.dto';

@Injectable()
export class AdminReportService {
  constructor(
    private adminRepository: AdminRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async getUserReportList() {
    const userReportList = await this.adminRepository.getUserReportList();

    return userReportList.map((userReport) => new UserReportDto(userReport));
  }

  async createUserReportResponse(
    adminId: number,
    createUserReportResponseDto: CreateUserReportResponseDto,
  ): Promise<UserReportDto> {
    const result = await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        await this.adminRepository.trxCreateUserReportResponse(transaction, {
          adminId,
          ...createUserReportResponseDto,
        });
        return await this.adminRepository.trxUpdateUserReportIsAnswered(
          transaction,
          createUserReportResponseDto.reportId,
        );
      },
    );

    return new UserReportDto(result);
  }
}
