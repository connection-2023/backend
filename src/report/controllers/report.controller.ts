import { Body, Controller, Post } from '@nestjs/common';
import { ReportService } from '@src/report/services/report.service';
import { CreateUserReportDto } from '@src/report/dtos/create-user-report-dto';

@Controller('reports')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post('/user')
  async createUserReport(@Body() createUserReportDto: CreateUserReportDto) {}
}
