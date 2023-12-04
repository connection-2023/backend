import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repository/admin.repository';
import { PrismaService } from '@src/prisma/prisma.service';

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
      },
    });
  }
}
