import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ReportService } from '@src/report/services/report.service';
import { CreateReportDto } from '@src/report/dtos/create-report-dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiCreateReport } from '@src/report/swagger-decorators/create-report.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { ApiGetUserReportList } from '../swagger-decorators/get-user-report-list.decorator';
import { GetMyReportListDto } from '../dtos/get-my-report-list.dto';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { LecturerReportDto } from '@src/common/dtos/lecturer-report.dto';
import { UserReportDto } from '@src/common/dtos/use-report.dto';

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
  ): Promise<void> {
    await this.reportService.createReport(authorizedData, createReportDto);
  }

  @ApiGetUserReportList()
  @SetResponseKey('reportList')
  @Get()
  @UseGuards(LecturerAccessTokenGuard)
  async getMyReportList(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() getMyReportListDto: GetMyReportListDto,
  ): Promise<UserReportDto[] | LecturerReportDto[]> {
    return await this.reportService.getMyReportList(
      authorizedData,
      getMyReportListDto,
    );
  }
}
