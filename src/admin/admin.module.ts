import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { AdminReportController } from './controllers/admin-report.controller';
import { AdminReportService } from './services/admin-report.service';
import { AdminRepository } from './repository/admin.repository';

@Module({
  controllers: [AdminController, AdminReportController],
  providers: [AdminService, AdminReportService, AdminRepository],
})
export class AdminModule {}
