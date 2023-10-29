import { Module } from '@nestjs/common';
import { PaymentsService } from './services/payments.service';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentsRepository } from './repository/payments.repository';

@Module({
  providers: [PaymentsService, PaymentsRepository],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
