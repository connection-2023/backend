import { Controller, Get, OnModuleInit, Post } from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('/verify-bank-account')
  async verifyBankAccount() {
    await this.paymentsService.verifyBankAccount();
  }
}
