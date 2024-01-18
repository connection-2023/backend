import { Module } from '@nestjs/common';
import { ReportService } from '@src/report/services/report.service';
import { UserReportController } from '@src/report/controllers/user-report.controller';
import { ReportRepository } from '@src/report/repository/report.repository';
import { LecturerReportController } from '@src/report/controllers/lecturer-report.controller';

@Module({
  providers: [ReportService, ReportRepository],
  controllers: [UserReportController, LecturerReportController],
})
export class ReportModule {}
