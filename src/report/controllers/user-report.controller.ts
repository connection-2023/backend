import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReportService } from '@src/report/services/report.service';
import { CreateUserReportDto } from '@src/report/dtos/create-user-report-dto';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { ApiTags } from '@nestjs/swagger';
import { ApiCreateUserReport } from '../swagger-decorators/create-user-report-decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';

@ApiTags('유저-신고')
@Controller('user-reports')
export class UserReportController {
  constructor(private reportService: ReportService) {}

  @ApiCreateUserReport()
  @Post()
  @UseGuards(UserAccessTokenGuard)
  async createUserReport(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createUserReportDto: CreateUserReportDto,
  ) {
    await this.reportService.createUserReport(
      authorizedData.user.id,
      createUserReportDto,
    );
  }
}
