import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from '@src/payments/services/payments.service';
import { GetLecturePaymentDto } from '@src/payments/dtos/get-lecture-payment.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ApiCreateLecturePaymentInfo } from '../swagger-decorators/create-lecture-payment-info-decorater';
import { ConfirmLecturePaymentDto } from '../dtos/get-lecture-payment.dto copy';

@ApiTags('결제')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // @Get('/verify-bank-account')
  // async verifyBankAccount() {
  //   await this.paymentsService.verifyBankAccount();
  // }

  @ApiCreateLecturePaymentInfo()
  @Post('/lecture')
  @UseGuards(UserAccessTokenGuard)
  async createLecturePaymentInfo(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() getLecturePaymentDto: GetLecturePaymentDto,
  ) {
    const lecturePaymentInfo =
      await this.paymentsService.createLecturePaymentInfo(
        authorizedData.user.id,
        getLecturePaymentDto,
      );

    return { lecturePaymentInfo };
  }

  @Patch('/lecture/confirm')
  async confirmLecturePayment(
    @Body() confirmLecturePaymentDto: ConfirmLecturePaymentDto,
  ) {
    await this.paymentsService.confirmLecturePayment(confirmLecturePaymentDto);
  }

  @Post('/lecture/status')
  async a(@Body() a) {
    // console.log(a);
  }
}
