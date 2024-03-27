import { Process, Processor } from '@nestjs/bull';
import { PaymentsService } from './payments.service';
import { Job } from 'bull';

@Processor('payments-queue')
export class PaymentsConsumer {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Process('handle-lecture-payments')
  async handleLecturePayments({ data }: Job) {
    await this.paymentsService.createLecturePaymentWithToss(data);
  }
}
