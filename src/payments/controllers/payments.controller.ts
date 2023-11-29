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
import { CreateLecturePaymentDto } from '@src/payments/dtos/create-lecture-payment.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ApiCreateLecturePaymentInfo } from '@src/payments/swagger-decorators/create-lecture-payment-info-decorater';
import { ConfirmLecturePaymentDto } from '@src/payments/dtos/confirm-lecture-payment.dto';
import { ApiConfirmPayment } from '@src/payments/swagger-decorators/confirm-payment-decorater';
import { IPaymentResult } from '@src/payments/interface/payments.interface';
import { ApiGetUserReceipt } from '@src/payments/swagger-decorators/get-user-receipt-decorator';
import { ApiCancelPayment } from '@src/payments/swagger-decorators/cancle-payment-decorator';
import { CreatePassPaymentDto } from '../dtos/create-pass-payment.dto';
import { ApiCreatePassPaymentInfo } from '../swagger-decorators/create-pass-payment-info-decorater';

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
    @Body() createLecturePaymentDto: CreateLecturePaymentDto,
  ) {
    const lecturePaymentInfo =
      await this.paymentsService.createLecturePaymentInfo(
        authorizedData.user.id,
        createLecturePaymentDto,
      );

    return { lecturePaymentInfo };
  }

  @ApiCreatePassPaymentInfo()
  @Post('/pass')
  @UseGuards(UserAccessTokenGuard)
  async createPassPaymentInfo(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createPassPaymentDto: CreatePassPaymentDto,
  ) {
    const passPaymentInfo = await this.paymentsService.createPassPaymentInfo(
      authorizedData.user.id,
      createPassPaymentDto,
    );

    return { passPaymentInfo };
  }

  @ApiConfirmPayment()
  @Patch('/confirm')
  @UseGuards(UserAccessTokenGuard)
  async confirmLecturePayment(
    @Body() confirmPaymentDto: ConfirmLecturePaymentDto,
  ) {
    const paymentResult: IPaymentResult =
      await this.paymentsService.confirmPayment(confirmPaymentDto);

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
