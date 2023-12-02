import { Module } from '@nestjs/common';
import { ReportService } from '@src/report/services/report.service';
import { UserReportController } from '@src/report/controllers/user-report.controller';
import { ReportRepository } from './repository/report.repository';

@Module({
  providers: [ReportService, ReportRepository],
  controllers: [UserReportController],
})
export class ReportModule {}
