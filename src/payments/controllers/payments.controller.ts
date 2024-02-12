import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from '@src/payments/services/payments.service';
import { CreateLecturePaymentWithTossDto } from '@src/payments/dtos/create-lecture-payment-with-toss.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ApiCreateLecturePaymentInfo } from '../swagger-decorators/ApiCreateLecturePaymentInfo';
import { ConfirmLecturePaymentDto } from '@src/payments/dtos/confirm-lecture-payment.dto';
import { ApiConfirmPayment } from '@src/payments/swagger-decorators/confirm-payment-decorater';
import { ApiCancelPayment } from '@src/payments/swagger-decorators/cancle-payment-decorator';
import { CreatePassPaymentDto } from '@src/payments/dtos/create-pass-payment.dto';
import { ApiCreatePassPaymentInfo } from '@src/payments/swagger-decorators/create-pass-payment-info-decorater';
import { CreateLecturePaymentWithPassDto } from '@src/payments/dtos/create-lecture-payment-with-pass.dto';
import { ApiCreateLecturePaymentWithPass } from '@src/payments/swagger-decorators/create-lecture-payment-with-pass-decorator';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { PaymentDto } from '../dtos/payment.dto';
import { PendingPaymentInfoDto } from '../dtos/pending-payment-info.dto';
import { Request } from 'express';

@ApiTags('결제')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // @Get('/verify-bank-account')
  // async verifyBankAccount() {
  //   await this.paymentsService.verifyBankAccount();
  // }

  //토스 페이먼츠로 클래스 결제
  @SetResponseKey('pendingPaymentInfo')
  @ApiCreateLecturePaymentInfo()
  @Post('/toss/lecture')
  @UseGuards(UserAccessTokenGuard)
  async createLecturePaymentWithToss(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createLecturePaymentDto: CreateLecturePaymentWithTossDto,
  ): Promise<PendingPaymentInfoDto> {
    return await this.paymentsService.createLecturePaymentWithToss(
      authorizedData.user.id,
      createLecturePaymentDto,
    );
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
  ): Promise<PaymentDto> {
    return await this.paymentsService.confirmPayment(confirmPaymentDto);
  }

  @ApiCancelPayment()
  @Post('/toss/:orderId/cancel')
  async cancelPayment(@Param('orderId') orderId: string): Promise<void> {
    return await this.paymentsService.cancelPayment(orderId);
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
  // @ApiCreateLecturePaymentWithTransfer()
  // @SetResponseKey('transferPaymentResult')
  // @Post('/transfer/lecture')
  // @UseGuards(UserAccessTokenGuard)
  // async createLecturePaymentWithTransfer(
  //   @GetAuthorizedUser() authorizedData: ValidateResult,
  //   @Body()
  //   createLecturePaymentWithTransferDto: CreateLecturePaymentWithTransferDto,
  // ): Promise<PaymentDto> {
  //   return await this.paymentsService.createLecturePaymentWithTransfer(
  //     authorizedData.user.id,
  //     createLecturePaymentWithTransferDto,
  //   );
  // }

  // @ApiCreateLecturePaymentWithDeposit()
  // @SetResponseKey('depositPaymentResult')
  // @Post('/deposit/lecture')
  // @UseGuards(UserAccessTokenGuard)
  // async createLecturePaymentWithDeposit(
  //   @GetAuthorizedUser() authorizedData: ValidateResult,
  //   @Body()
  //   createLecturePaymentWithDepositDto: CreateLecturePaymentWithDepositDto,
  // ) {
  //   return await this.paymentsService.createLecturePaymentWithDeposit(
  //     authorizedData.user.id,
  //     createLecturePaymentWithDepositDto,
  //   );
  // }

  @Post('/:paymentId/refund')
  // @UseGuards(UserAccessTokenGuard)
  async handleRefund(
    // @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('paymentId', ParseIntPipe) paymentId: number,
  ) {
    await this.paymentsService.handleRefund(1, paymentId);
  }

  @Post('/toss/status')
  async handleVirtualAccountPaymentStatusWebhook(
    @Req() req: Request,
  ): Promise<void> {
    await this.paymentsService.handleVirtualAccountPaymentStatusWebhook(
      req.body,
    );
  }
}
