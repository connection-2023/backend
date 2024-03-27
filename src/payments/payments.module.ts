import { Module } from '@nestjs/common';
import { PaymentsService } from '@src/payments/services/payments.service';
import { PaymentsController } from '@src/payments/controllers/payments.controller';
import { PaymentsRepository } from '@src/payments/repository/payments.repository';
import { UserPaymentsService } from '@src/payments/services/user-payments.service';
import { UserPaymentsController } from '@src/payments/controllers/user-payments.controller';
import { LecturerPaymentsController } from '@src/payments/controllers/lecturer-payments.controller';
import { LecturerPaymentsService } from '@src/payments/services/lecturer-payments.service';
import { BullModule } from '@nestjs/bull';
import { PaymentsConsumer } from './services/payments-consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'payments-queue',
    }),
  ],
  providers: [
    PaymentsService,
    UserPaymentsService,
    PaymentsRepository,
    LecturerPaymentsService,
    PaymentsConsumer,
  ],
  controllers: [
    PaymentsController,
    UserPaymentsController,
    LecturerPaymentsController,
  ],
})
export class PaymentsModule {}
