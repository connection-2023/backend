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
import { SaveUserBankAccountDto } from '@src/payments/dtos/save-user-bank-account.dto';
import { UserBankAccountDto } from '@src/payments/dtos/user-bank-account.dto';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { ApiCreateUserBankAccount } from '../swagger-decorators/save-user-bank-account.decorator';

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
  ) {
    return await this.userPaymentsService.getUserPaymentsHistory(
      getUserPaymentsHistoryDto,
      authorizedData.user.id,
    );
  }

  @ApiPaymentVirtualAccount()
  @Get('/:paymentId/virtual-account')
  @UseGuards(UserAccessTokenGuard)
  async getPaymentVirtualAccount(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('paymentId', ParseIntPipe) paymentId: number,
  ) {
    return await this.userPaymentsService.getPaymentVirtualAccount(
      authorizedData.user.id,
      paymentId,
    );
  }

  @ApiCreateUserBankAccount()
  @SetResponseKey('createdUserBankAccount')
  @Post('/bank-account')
  @UseGuards(UserAccessTokenGuard)
  async createUserBankAccount(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() saveUserBankAccountDto: SaveUserBankAccountDto,
  ): Promise<UserBankAccountDto> {
    return await this.userPaymentsService.createUserBankAccount(
      authorizedData.user.id,
      saveUserBankAccountDto,
    );
  }
}
