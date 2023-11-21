import { Module } from '@nestjs/common';
import { PaymentsService } from './services/payments.service';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentsRepository } from './repository/payments.repository';
import { UserPaymentsService } from './services/user-payments.service';
import { UserPaymentsController } from './controllers/user-payments.controller';

@Module({
  providers: [PaymentsService, UserPaymentsService, PaymentsRepository],
  controllers: [PaymentsController, UserPaymentsController],
})
export class PaymentsModule {}
