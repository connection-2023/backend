import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { GetLecturePaymentDto } from '../dtos/get-lecture-payment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('결제')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('/verify-bank-account')
  async verifyBankAccount() {
    await this.paymentsService.verifyBankAccount();
  }

  @Post('/lecture')
  async createLecturePaymentInfo(
    @Body() getLecturePaymentDto: GetLecturePaymentDto,
  ) {
    await this.paymentsService.createLecturePaymentInfo(getLecturePaymentDto);
  }
}
