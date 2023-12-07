import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ReportService } from '@src/report/services/report.service';
import { CreateReportDto } from '@src/report/dtos/create-report-dto';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { ApiTags } from '@nestjs/swagger';
import { ApiCreateReport } from '@src/report/swagger-decorators/create-report.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { GetMyReportListDto } from '@src/report/dtos/get-my-report-list.dto';
import { ApiGetUserReportList } from '@src/report/swagger-decorators/get-user-report-list.decorator';
import { UserReportDto } from '@src/common/dtos/use-report.dto';
import { LecturerReportDto } from '@src/common/dtos/lecturer-report.dto';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';

@ApiTags('유저-신고')
@Controller('user-reports')
export class UserReportController {
  constructor(private reportService: ReportService) {}

  @ApiCreateReport()
  @Post()
  @UseGuards(UserAccessTokenGuard)
  async createUserReport(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createUserReportDto: CreateReportDto,
  ): Promise<void> {
    await this.reportService.createReport(authorizedData, createUserReportDto);
  }

  @ApiGetUserReportList()
  @SetResponseKey('reportList')
  @Get()
  @UseGuards(UserAccessTokenGuard)
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
