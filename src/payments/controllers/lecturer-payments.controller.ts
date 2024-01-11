import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
import { ApiGetPaymentRequestList } from '@src/payments/swagger-decorators/create-lecturer-bank-account.decorator copy';
import { PaymentRequestDto } from '@src/payments/dtos/payment-request.dto';

@ApiTags('강사-결제')
@Controller('lecturer-payments')
export class LecturerPaymentsController {
  constructor(
    private readonly lecturerPaymentsService: LecturerPaymentsService,
  ) {}

  @ApiGetLecturerRecentBankAccount()
  @SetResponseKey('lecturerRecentBankAccount')
  @Get('/recent-bank-account')
  @UseGuards(LecturerAccessTokenGuard)
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
  @UseGuards(LecturerAccessTokenGuard)
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
  @UseGuards(LecturerAccessTokenGuard)
  async getPaymentRequestList(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ): Promise<PaymentRequestDto[]> {
    return await this.lecturerPaymentsService.getPaymentRequestList(
      authorizedData.lecturer.id,
    );
  }
}
