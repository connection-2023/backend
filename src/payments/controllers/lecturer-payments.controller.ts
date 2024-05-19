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
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { CreateBankAccountDto } from '@src/payments/dtos/create-bank-account.dto';
import { LecturerBankAccountDto } from '@src/payments/dtos/lecturer-bank-account.dto';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { PaymentRequestDto } from '@src/payments/dtos/payment-request.dto';
import { PassSituationDto } from '@src/payments/dtos/response/pass-situation.dto';
import { GetRevenueStatisticsDto } from '../dtos/request/get-revenue-statistics.dto';
import { plainToInstance } from 'class-transformer';
import { RevenueStatisticDto } from '../dtos/response/revenue-statistic.dto';
import { GetLecturerPaymentListDto } from '../dtos/request/get-lecturer-payment-list.dto';
import { LecturerPaymentItemDto } from '../dtos/response/lecturer-payment-item.dto';
import { GetTotalRevenueDto } from '../dtos/request/get-total-revenue.dto';
import { ApiLecturerPayments } from './swagger/lecturer-payments.swagger';
import { UpdatePaymentRequestStatusDto } from '../dtos/update-payment-request.dto';

@ApiTags('강사-결제')
@UseGuards(LecturerAccessTokenGuard)
@Controller('lecturer-payments')
export class LecturerPaymentsController {
  constructor(
    private readonly lecturerPaymentsService: LecturerPaymentsService,
  ) {}

  @ApiLecturerPayments.GetLecturerPaymentList({ summary: '판매 내역' })
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

  @ApiLecturerPayments.GetTotalRevenue({ summary: '총 매출액' })
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

  @ApiLecturerPayments.GetRevenueStatistics({ summary: '매출 통계' })
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

  @ApiLecturerPayments.GetUserRecentBankAccount({
    summary: '강사가 최근 등록(사용)한 계좌 조회',
  })
  @SetResponseKey('lecturerRecentBankAccount')
  @Get('/recent-bank-account')
  async getUserRecentBankAccount(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ): Promise<LecturerBankAccountDto> {
    return await this.lecturerPaymentsService.getLecturerRecentBankAccount(
      authorizedData.lecturer.id,
    );
  }

  @ApiLecturerPayments.CreateLecturerBankAccount({
    summary: '강사 계좌 등록',
  })
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

  @ApiLecturerPayments.GetMyPassSituation({ summary: '패스권 판매 현황' })
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

  //todo 사용 여부 확이
  // @ApiLecturerPayments.GetPaymentRequestList({
  //   summary: '입금 대기 중인 결제내역 조회',
  // })
  // @SetResponseKey('requestList')
  // @Get('/requests')
  // async getPaymentRequestList(
  //   @GetAuthorizedUser() authorizedData: ValidateResult,
  // ): Promise<PaymentRequestDto[]> {
  //   return await this.lecturerPaymentsService.getPaymentRequestList(
  //     authorizedData.lecturer.id,
  //   );
  // }

  // @ApiLecturerPayments.GetPaymentRequestCount({
  //   summary: '입금 대기 중인 결제 건수 조회',
  // })
  // @SetResponseKey('requestCount')
  // @Get('/requests/count')
  // async getPaymentRequestCount(
  //   @GetAuthorizedUser() authorizedData: ValidateResult,
  // ): Promise<number> {
  //   return await this.lecturerPaymentsService.getPaymentRequestCount(
  //     authorizedData.lecturer.id,
  //   );
  // }

  // @ApiLecturerPayments.UpdatePaymentRequestStatus({
  //   summary: '결제 요청 상태 변경',
  // })
  // @Patch('/request')
  // async updatePaymentRequestStatus(
  //   @GetAuthorizedUser() authorizedData: ValidateResult,
  //   @Body() updatePaymentRequestStatusDto: UpdatePaymentRequestStatusDto,
  // ): Promise<void> {
  //   await this.lecturerPaymentsService.updatePaymentRequestStatus(
  //     authorizedData.lecturer.id,
  //     updatePaymentRequestStatusDto,
  //   );
  // }
}
