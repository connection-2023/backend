import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from '@src/payments/services/payments.service';
import { GetLecturePaymentDto } from '@src/payments/dtos/get-lecture-payment.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ApiCreateLecturePaymentInfo } from '@src/payments/swagger-decorators/create-lecture-payment-info-decorater';
import { ConfirmLecturePaymentDto } from '@src/payments/dtos/confirm-lecture-payment.dto';
import { ApiConfirmLecturePayment } from '@src/payments/swagger-decorators/confirm-lecture-payment-decorater';
import { IPaymentResult } from '@src/payments/interface/payments.interface';
import { ApiGetUserReceipt } from '@src/payments/swagger-decorators/get-user-receipt-decorator';
import { ApiCancelPayment } from '@src/payments/swagger-decorators/cancle-payment-decorator';

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
    console.log(getLecturePaymentDto);

    const lecturePaymentInfo =
      await this.paymentsService.createLecturePaymentInfo(
        authorizedData.user.id,
        getLecturePaymentDto,
      );

    return { lecturePaymentInfo };
  }

  @ApiConfirmLecturePayment()
  @Patch('/lecture/confirm')
  async confirmLecturePayment(
    @Body() confirmLecturePaymentDto: ConfirmLecturePaymentDto,
  ) {
    const paymentResult: IPaymentResult =
      await this.paymentsService.confirmLecturePayment(
        confirmLecturePaymentDto,
      );

    return { paymentResult };
  }

  @ApiGetUserReceipt()
  @Get('/user-receipt')
  @UseGuards(UserAccessTokenGuard)
  async getUserReceipt(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query('orderId') orderId: string,
  ) {
    const receipt = await this.paymentsService.getUserReceipt(
      authorizedData.user.id,
      orderId,
    );

    return { receipt };
  }

  @ApiCancelPayment()
  @Post('/:orderId/cancel')
  async cancelPayment(@Param('orderId') orderId: string) {
    await this.paymentsService.cancelPayment(orderId);
  }
}
