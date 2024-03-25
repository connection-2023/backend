import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserPaymentsService } from '@src/payments/services/user-payments.service';
import { GetUserPaymentsHistoryDto } from '@src/payments/dtos/get-user-payments-history.dto';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ApiGetUserPaymentsHistory } from '@src/payments/swagger-decorators/get-user-payments-history-decorator';
import { ApiPaymentVirtualAccount } from '@src/payments/swagger-decorators/get-payment-virtual-account-decorator';
import { CreateBankAccountDto } from '@src/payments/dtos/create-bank-account.dto';
import { UserBankAccountDto } from '@src/payments/dtos/user-bank-account.dto';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { ApiCreateUserBankAccount } from '../swagger-decorators/save-user-bank-account.decorator';
import { ApiGetUserRecentBankAccount } from '../swagger-decorators/get-user-recent-bank-account.decorator';
import { ApiGetUserReceipt } from '../swagger-decorators/get-user-receipt-decorator';
import { DetailPaymentInfoDto } from '../dtos/response/detail-payment.dto';
import { plainToInstance } from 'class-transformer';
import { VirtualAccountDepositDetailsDto } from '../dtos/response/virtual-account-deposit-details.dto';
import { ApiUserPayments } from './swagger/user-payments.swagger';

@ApiTags('유저-결제')
@Controller('user-payments')
export class UserPaymentsController {
  constructor(private readonly userPaymentsService: UserPaymentsService) {}

  @ApiGetUserPaymentsHistory()
  @Get('/history')
  @UseGuards(UserAccessTokenGuard)
  async GetUserPaymentsHistory(
    @Query() getUserPaymentsHistoryDto: GetUserPaymentsHistoryDto,
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ): Promise<{
    totalItemCount: Number;
    userPaymentsHistory?: DetailPaymentInfoDto[];
  }> {
    const { totalItemCount, userPaymentsHistory } =
      await this.userPaymentsService.getUserPaymentsHistory(
        getUserPaymentsHistoryDto,
        authorizedData.user.id,
      );

    return {
      totalItemCount,
      userPaymentsHistory: plainToInstance(
        DetailPaymentInfoDto,
        userPaymentsHistory,
      ),
    };
  }

  @ApiGetUserReceipt()
  @SetResponseKey('receipt')
  @Get('/history/:orderId')
  @UseGuards(UserAccessTokenGuard)
  async getUserReceipt(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('orderId') orderId: string,
  ): Promise<DetailPaymentInfoDto> {
    return await this.userPaymentsService.getUserReceipt(
      authorizedData.user.id,
      orderId,
    );
  }

  @ApiUserPayments.GetVirtualAccountDepositDetails({
    summary: '가상 계좌 입금 정보 조회',
  })
  @SetResponseKey('virtualAccountDepositDetails')
  @Get('/:paymentId/virtual-account')
  @UseGuards(UserAccessTokenGuard)
  async getVirtualAccountDepositDetails(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('paymentId', ParseIntPipe) paymentId: number,
  ): Promise<VirtualAccountDepositDetailsDto> {
    return await this.userPaymentsService.getVirtualAccountDepositDetails(
      authorizedData.user.id,
      paymentId,
    );
  }

  @ApiGetUserRecentBankAccount()
  @SetResponseKey('userRecentBankAccount')
  @Get('/recent-bank-account')
  @UseGuards(UserAccessTokenGuard)
  async getUserRecentBankAccount(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ): Promise<UserBankAccountDto> {
    return await this.userPaymentsService.getUserRecentBankAccount(
      authorizedData.user.id,
    );
  }

  @ApiCreateUserBankAccount()
  @SetResponseKey('createdUserBankAccount')
  @Post('/bank-account')
  @UseGuards(UserAccessTokenGuard)
  async createUserBankAccount(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createBankAccountDto: CreateBankAccountDto,
  ): Promise<UserBankAccountDto> {
    return await this.userPaymentsService.createUserBankAccount(
      authorizedData.user.id,
      createBankAccountDto,
    );
  }
}
