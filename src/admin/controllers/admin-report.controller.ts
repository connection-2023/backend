import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AdminReportService } from '../services/admin-report.service';
import { AdminAccessTokenGuard } from '@src/common/guards/admin-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { CreateUserReportResponseDto } from '../dtos/create-user-report-response.dto';
import { UserReportDto } from '@src/common/dtos/use-report.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiGetUserReportList } from '../swagger-decorators/get-user-report-list.decorator';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';

@ApiTags('관리자 - 신고')
@UseGuards(AdminAccessTokenGuard)
@Controller('admin-reports')
export class AdminReportController {
  constructor(private adminReportService: AdminReportService) {}

  @ApiGetUserReportList()
  @SetResponseKey('userReportList')
  @Get()
  async getUserReportList(): Promise<UserReportDto[]> {
    return await this.adminReportService.getUserReportList();
  }

  @SetResponseKey('userReport')
  @Post()
  async createUserReportResponse(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createUserReportResponseDto: CreateUserReportResponseDto,
  ): Promise<UserReportDto> {
    return await this.adminReportService.createUserReportResponse(
      authorizedData.admin.id,
      createUserReportResponseDto,
    );
  }
}
