import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ReportService } from '@src/report/services/report.service';
import { CreateReportDto } from '@src/report/dtos/create-report-dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiCreateReport } from '@src/report/swagger-decorators/create-report.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { ApiGetMyReportList } from '../swagger-decorators/get-my-report-list.decorator';
import { GetMyReportListDto } from '../dtos/get-my-report-list.dto';

@ApiTags('강사-신고')
@Controller('lecturer-reports')
export class LecturerReportController {
  constructor(private reportService: ReportService) {}

  @ApiCreateReport()
  @Post()
  @UseGuards(LecturerAccessTokenGuard)
  async createUserReport(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createReportDto: CreateReportDto,
  ) {
    await this.reportService.createReport(authorizedData, createReportDto);
  }

  @ApiGetMyReportList()
  @Get()
  @UseGuards(LecturerAccessTokenGuard)
  async getMyReportList(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() getMyReportListDto: GetMyReportListDto,
  ) {
    const reportList = await this.reportService.getMyReportList(
      authorizedData,
      getMyReportListDto,
    );

    return { reportList };
  }
}
