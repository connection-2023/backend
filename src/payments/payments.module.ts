import { Module } from '@nestjs/common';
import { PaymentsService } from './services/payments.service';
import { PaymentsController } from './controllers/payments.controller';

@Module({
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
