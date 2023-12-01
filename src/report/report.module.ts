import { Module } from '@nestjs/common';
import { ReportService } from '@src/report/services/report.service';
import { ReportController } from '@src/report/controllers/report.controller';

@Module({
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
