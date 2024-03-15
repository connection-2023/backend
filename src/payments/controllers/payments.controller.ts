import {
  BadRequestException,
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
import { CreatePassPaymentDto } from '@src/payments/dtos/create-pass-payment.dto';
import { CreateLecturePaymentWithPassDto } from '@src/payments/dtos/create-lecture-payment-with-pass.dto';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { PendingPaymentInfoDto } from '../dtos/pending-payment-info.dto';
import { Request } from 'express';
import { HandleRefundDto } from '../dtos/request/handle-refund.dto';
import { PaymentHistoryTypes, PaymentMethods } from '../constants/enum';
import { LecturePaymentWithPassUsageDto } from '../dtos/response/lecture-payment-with-pass-usage.dto';
import { ApiPayments } from './swagger/payments.swagger';
import { PaymentResultDto } from '../dtos/response/payment-result.dto';
import { HandleDepositStatusDto } from '../dtos/request/handle-deposit-status.dto';
import { HandlePaymentDto } from '../dtos/request/handle-payment.dto';

@ApiTags('결제')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiPayments.GetPaymentResult({ summary: '결제 결과 조회' })
  @SetResponseKey('paymentResult')
  @UseGuards(UserAccessTokenGuard)
  @Get(':orderId')
  async getPaymentResult(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('orderId') orderId: string,
  ): Promise<PaymentResultDto> {
    return await this.paymentsService.getPaymentResultByOrderId(
      authorizedData.user.id,
      orderId,
    );
  }

  @ApiPayments.CreateLecturePaymentWithToss({
    summary: '토스-강의 결제를 위한 기본 결제 정보 생성',
  })
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

  @ApiPayments.ConfirmLecturePayment({
    summary: '토스-패스권 결제를 위한 기본 결제 정보 생성',
    description: '반환값 pendingPaymentInfo으로 변경',
  })
  @SetResponseKey('pendingPaymentInfo')
  @Post('/toss/pass')
  @UseGuards(UserAccessTokenGuard)
  async createPassPaymentWithToss(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createPassPaymentDto: CreatePassPaymentDto,
  ): Promise<PendingPaymentInfoDto> {
    return await this.paymentsService.createPassPaymentWithToss(
      authorizedData.user.id,
      createPassPaymentDto,
    );
  }

  @ApiPayments.ConfirmLecturePayment({
    summary: '결제 승인 paymentKey사용',
    description: ' 결제 결과는 /payments/:orderId로',
  })
  @Patch('/toss/confirm')
  @UseGuards(UserAccessTokenGuard)
  async confirmLecturePayment(
    @Body() confirmPaymentDto: ConfirmLecturePaymentDto,
  ): Promise<void> {
    await this.paymentsService.confirmPayment(confirmPaymentDto);
  }

  @ApiPayments.CancelPayment({ summary: '결제 진행 중 취소' })
  @Post('/toss/:orderId/cancel')
  async cancelPayment(@Param('orderId') orderId: string): Promise<void> {
    await this.paymentsService.cancelPayment(orderId);
  }

  @ApiPayments.CreateLecturePaymentWithPass({
    summary: '패스권으로 클래스 결제 반환값 paymentResultByPass로 변경',
  })
  @SetResponseKey('paymentResultByPass')
  @Post('/pass/lecture')
  @UseGuards(UserAccessTokenGuard)
  async createLecturePaymentWithPass(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createLecturePaymentWithPassDto: CreateLecturePaymentWithPassDto,
  ): Promise<LecturePaymentWithPassUsageDto> {
    return await this.paymentsService.createLecturePaymentWithPass(
      authorizedData.user.id,
      createLecturePaymentWithPassDto,
    );
  }

  @ApiPayments.HandleRefund({ summary: '환불 처리' })
  @Post('/:paymentId/refund')
  @UseGuards(UserAccessTokenGuard)
  async handleRefund(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('paymentId', ParseIntPipe) paymentId: number,
    @Body() handleRefundDto: HandleRefundDto,
  ): Promise<void> {
    const { reservation, userPass, ...payment } =
      await this.paymentsService.getUserPaymentForRefund(
        authorizedData.user.id,
        paymentId,
      );

    if (
      payment.paymentMethodId === PaymentMethods.가상계좌 &&
      !handleRefundDto.userBankAccountId
    ) {
      throw new BadRequestException(
        `환불 계좌가 필요한 결제입니다.`,
        'RefundAccountRequired',
      );
    }

    if (payment.paymentProductTypeId === PaymentHistoryTypes.클래스) {
      await this.paymentsService.handleLectureRefund(
        authorizedData.user.id,
        payment,
        reservation,
        handleRefundDto,
      );
    } else if (payment.paymentProductTypeId === PaymentHistoryTypes.패스권) {
    }
  }

  @ApiPayments.HandlePaymentStatusWebhook({
    summary: '토스 페이먼츠 웹훅 ',
  })
  @Post('/toss/status')
  async handlePaymentStatusWebhook(
    @Body() handlePaymentDto: HandlePaymentDto,
  ): Promise<void> {
    await this.paymentsService.handlePaymentStatusWebhook(
      handlePaymentDto.data,
    );
  }

  @ApiPayments.HandleVirtualAccountPaymentStatusWebhook({
    summary: '토스 페이먼츠 계좌이체 웹훅 ',
  })
  @Post('/toss/deposit-status')
  async handleVirtualAccountPaymentStatusWebhook(
    @Body() handleDepositStatusDto: HandleDepositStatusDto,
  ): Promise<void> {
    await this.paymentsService.handleVirtualAccountPaymentStatusWebhook(
      handleDepositStatusDto,
    );
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
}
