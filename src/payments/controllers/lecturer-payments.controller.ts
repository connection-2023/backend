import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LecturerPaymentsService } from '@src/payments/services/lecturer-payments.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiCreateLecturerBankAccount } from '@src/payments/swagger-decorators/create-lecturer-bank-account.decorator';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { CreateBankAccountDto } from '@src/payments/dtos/create-bank-account.dto';
import { LecturerBankAccountDto } from '@src/payments/dtos/lecturer-bank-account.dto';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { ApiGetLecturerRecentBankAccount } from '@src/payments/swagger-decorators/get-lecturer-recent-bank-account.decorator';
import { ApiGetPaymentRequestList } from '@src/payments/swagger-decorators/get-payment-request-list.decorator';
import { PaymentRequestDto } from '@src/payments/dtos/payment-request.dto';
import { UpdatePaymentRequestStatusDto } from '@src/payments/dtos/update-payment-request.dto';
import { ApiUpdatePaymentRequestStatus } from '@src/payments/swagger-decorators/update-payment-request-status.decorator';
import { ApiGetPaymentRequestCount } from '@src/payments/swagger-decorators/get-lecturer-payment-request-count.decorator';
import { PassSituationDto } from '@src/payments/dtos/response/pass-situation.dto';
import { ApiGetMyPassSituation } from '@src/payments/swagger-decorators/get-my-pass-situation.decorator';
import { GetRevenueStatisticsDto } from '../dtos/request/get-revenue-statistics.dto';
import { ApiGetRevenueStatistics } from '../swagger-decorators/get-revenue-statistics.decorator';
import { plainToInstance } from 'class-transformer';
import { RevenueStatisticDto } from '../dtos/response/revenue-statistic.dto';
import { GetLecturerPaymentListDto } from '../dtos/request/get-lecturer-payment-list.dto';
import { LecturerPaymentItemDto } from '../dtos/response/lecturer-payment-item.dto';
import { ApiGetLecturerPaymentList } from '../swagger-decorators/get-lecturer-payment-list.decorator';
import { GetTotalRevenueDto } from '../dtos/request/get-total-revenue.dto';
import { ApiGetTotalRevenue } from '../swagger-decorators/get-total-revenue.decorator';

@ApiTags('강사-결제')
@UseGuards(LecturerAccessTokenGuard)
@Controller('lecturer-payments')
export class LecturerPaymentsController {
  constructor(
    private readonly lecturerPaymentsService: LecturerPaymentsService,
  ) {}

  @ApiGetLecturerPaymentList()
  @Get()
  async getLecturerPaymentList(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() getLecturerPaymentListDto: GetLecturerPaymentListDto,
  ): Promise<{
    totalItemCount: Number;
    lecturerPaymentList: LecturerPaymentItemDto[];
  }> {
    const { totalItemCount, lecturerPaymentList } =
      await this.lecturerPaymentsService.getLecturerPaymentList(
        authorizedData.lecturer.id,
        getLecturerPaymentListDto,
      );

    return {
      totalItemCount,
      lecturerPaymentList: plainToInstance(
        LecturerPaymentItemDto,
        lecturerPaymentList,
      ),
    };
  }

  @ApiGetTotalRevenue()
  @SetResponseKey('totalRevenue')
  @Get('/total-revenue')
  async getTotalRevenue(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() getTotalRevenueDto: GetTotalRevenueDto,
  ): Promise<number> {
    return await this.lecturerPaymentsService.getTotalRevenue(
      authorizedData.lecturer.id,
      getTotalRevenueDto,
    );
  }

  @ApiGetRevenueStatistics()
  @SetResponseKey('revenueStatistics')
  @Get('/revenue-statistics')
  async getRevenueStatistics(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() getRevenueStatisticsDto: GetRevenueStatisticsDto,
  ): Promise<RevenueStatisticDto[]> {
    const revenueStatistics: RevenueStatisticDto[] =
      await this.lecturerPaymentsService.getRevenueStatistics(
        authorizedData.lecturer.id,
        getRevenueStatisticsDto,
      );

    return plainToInstance(RevenueStatisticDto, revenueStatistics);
  }

  @ApiGetLecturerRecentBankAccount()
  @SetResponseKey('lecturerRecentBankAccount')
  @Get('/recent-bank-account')
  async getUserRecentBankAccount(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ): Promise<LecturerBankAccountDto> {
    return await this.lecturerPaymentsService.getLecturerRecentBankAccount(
      authorizedData.lecturer.id,
    );
  }

  @ApiCreateLecturerBankAccount()
  @SetResponseKey('createdLecturerBankAccount')
  @Post('/bank-account')
  async createLecturerBankAccount(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createBankAccountDto: CreateBankAccountDto,
  ): Promise<LecturerBankAccountDto> {
    return await this.lecturerPaymentsService.createLecturerBankAccount(
      authorizedData.lecturer.id,
      createBankAccountDto,
    );
  }

  @ApiGetPaymentRequestList()
  @SetResponseKey('requestList')
  @Get('/requests')
  async getPaymentRequestList(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ): Promise<PaymentRequestDto[]> {
    return await this.lecturerPaymentsService.getPaymentRequestList(
      authorizedData.lecturer.id,
    );
  }

  @ApiGetPaymentRequestCount()
  @SetResponseKey('requestCount')
  @Get('/requests/count')
  async getPaymentRequestCount(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ): Promise<number> {
    return await this.lecturerPaymentsService.getPaymentRequestCount(
      authorizedData.lecturer.id,
    );
  }

  @ApiUpdatePaymentRequestStatus()
  @Patch('/request')
  async updatePaymentRequestStatus(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() updatePaymentRequestStatusDto: UpdatePaymentRequestStatusDto,
  ): Promise<void> {
    await this.lecturerPaymentsService.updatePaymentRequestStatus(
      authorizedData.lecturer.id,
      updatePaymentRequestStatusDto,
    );
  }

  @ApiGetMyPassSituation()
  @SetResponseKey('passSituationList')
  @Get('passes/:passId')
  async getMyPassSituation(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('passId', ParseIntPipe) passId: number,
  ): Promise<PassSituationDto[]> {
    return await this.lecturerPaymentsService.getPassSituation(
      authorizedData.lecturer.id,
      passId,
    );
  }
}
