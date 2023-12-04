import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminReportService } from '../services/admin-report.service';
import { AdminAccessTokenGuard } from '@src/common/guards/admin-access-token.guard';

@UseGuards(AdminAccessTokenGuard)
@Controller('admin-reports')
export class AdminReportController {
  constructor(private reportService: AdminReportService) {}

  @Get()
  async getUserReportList() {
    const userReportList = await this.reportService.getUserReportList();
    return { userReportList };
  }
}
