import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserPaymentsService } from '../services/user-payments.service';
import { GetUserPaymentsHistoryDto } from '../dtos/get-user-payments-history.dto';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ApiGetUserPaymentsHistory } from '../swagger-decorators/get-user-payments-history-decorator';
import { ApiPaymentVirtualAccount } from '../swagger-decorators/get-payment-virtual-account-decorator';

@ApiTags('결제')
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
    const paymentVirtualAccountInfo =
      await this.userPaymentsService.getPaymentVirtualAccount(
        authorizedData.user.id,
        paymentId,
      );

    return paymentVirtualAccountInfo;
  }
}
