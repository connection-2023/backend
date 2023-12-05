import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AdminReportService } from '../services/admin-report.service';
import { AdminAccessTokenGuard } from '@src/common/guards/admin-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { UserType } from '@src/common/enum/enum';
import { CreateUserReportResponseDto } from '../dtos/create-user-report-response.dto';

@UseGuards(AdminAccessTokenGuard)
@Controller('admin-reports')
export class AdminReportController {
  constructor(private adminReportService: AdminReportService) {}

  @Get()
  async getUserReportList() {
    const userReportList = await this.adminReportService.getUserReportList();
    return { userReportList };
  }

  @Post()
  async createUserReportResponse(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createUserReportResponseDto: CreateUserReportResponseDto,
  ) {
    return await this.adminReportService.createUserReportResponse(
      authorizedData.admin.id,
      UserType.USER,
      createUserReportResponseDto,
    );
  }
}
