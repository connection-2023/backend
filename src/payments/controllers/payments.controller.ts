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
import { CreateLecturePaymentWithTossDto } from '@src/payments/dtos/create-lecture-payment-with-toss.dto';
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
import { CreatePassPaymentDto } from '@src/payments/dtos/create-pass-payment.dto';
import { ApiCreatePassPaymentInfo } from '@src/payments/swagger-decorators/create-pass-payment-info-decorater';
import { CreateLecturePaymentWithPassDto } from '@src/payments/dtos/create-lecture-payment-with-pass.dto';
import { ApiCreateLecturePaymentWithPass } from '@src/payments/swagger-decorators/create-lecture-payment-with-pass-decorator';
import { CreateLecturePaymentWithTransferDto } from '../dtos/create-lecture-payment-with-transfer.dto';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { PaymentDto } from '../dtos/payment.dto';
import { ApiCreateLecturePaymentWithTransfer } from '../swagger-decorators/create-lecture-payment-info-with-transfer-decorater';

@ApiTags('결제')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // @Get('/verify-bank-account')
  // async verifyBankAccount() {
  //   await this.paymentsService.verifyBankAccount();
  // }

  //토스 페이먼츠로 클래스 결제
  @ApiCreateLecturePaymentInfo()
  @Post('/toss/lecture')
  @UseGuards(UserAccessTokenGuard)
  async createLecturePaymentWithToss(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createLecturePaymentDto: CreateLecturePaymentWithTossDto,
  ) {
    const lecturePaymentInfo =
      await this.paymentsService.createLecturePaymentWithToss(
        authorizedData.user.id,
        createLecturePaymentDto,
      );

    return { lecturePaymentInfo };
  }

  //토스 페이먼츠로 패스권 결제
  @ApiCreatePassPaymentInfo()
  @Post('/toss/pass')
  @UseGuards(UserAccessTokenGuard)
  async createPassPaymentWithToss(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createPassPaymentDto: CreatePassPaymentDto,
  ) {
    const passPaymentInfo =
      await this.paymentsService.createPassPaymentWithToss(
        authorizedData.user.id,
        createPassPaymentDto,
      );

    return { passPaymentInfo };
  }

  @ApiConfirmPayment()
  @Patch('/toss/confirm')
  @UseGuards(UserAccessTokenGuard)
  async confirmLecturePayment(
    @Body() confirmPaymentDto: ConfirmLecturePaymentDto,
  ) {
    const paymentResult: IPaymentResult =
      await this.paymentsService.confirmPayment(confirmPaymentDto);

    return { paymentResult };
  }

  @ApiCancelPayment()
  @Post('/toss/:orderId/cancel')
  async cancelPayment(@Param('orderId') orderId: string) {
    await this.paymentsService.cancelPayment(orderId);
  }

  //패스권으로 클래스 결제
  @ApiCreateLecturePaymentWithPass()
  @Post('/pass/lecture')
  @UseGuards(UserAccessTokenGuard)
  async createLecturePaymentWithPass(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createLecturePaymentWithPassDto: CreateLecturePaymentWithPassDto,
  ) {
    const paymentResult =
      await this.paymentsService.createLecturePaymentWithPass(
        authorizedData.user.id,
        createLecturePaymentWithPassDto,
      );

    return { paymentResult };
  }

  //일반결제(계좌이체)
  @ApiCreateLecturePaymentWithTransfer()
  @SetResponseKey('paymentResult')
  @Post('/transfer/lecture')
  @UseGuards(UserAccessTokenGuard)
  async createLecturePaymentWithTransfer(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body()
    createLecturePaymentWithTransferDto: CreateLecturePaymentWithTransferDto,
  ): Promise<PaymentDto> {
    return await this.paymentsService.createLecturePaymentWithTransfer(
      authorizedData.user.id,
      createLecturePaymentWithTransferDto,
    );
  }

  @ApiGetUserReceipt()
  @SetResponseKey('receipt')
  @Get('/user-receipt')
  @UseGuards(UserAccessTokenGuard)
  async getUserReceipt(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query('orderId') orderId: string,
  ): Promise<PaymentDto> {
    return await this.paymentsService.getUserReceipt(
      authorizedData.user.id,
      orderId,
    );
  }
}
