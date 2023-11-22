import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsRepository } from '@src/payments/repository/payments.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { GetUserPaymentsHistoryDto } from '../dtos/get-user-payments-history.dto';

@Injectable()
export class UserPaymentsService implements OnModuleInit {
  private readonly logger = new Logger(UserPaymentsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly paymentsRepository: PaymentsRepository,
    private readonly prismaService: PrismaService,
  ) {}

  onModuleInit() {
    this.logger.log('PaymentsService Init');
  }

  async getUserPaymentsHistory(
    { take, skip, lastItemId, paymentHistoryType }: GetUserPaymentsHistoryDto,
    userId: number,
  ) {
    const paymentCount: number =
      await this.paymentsRepository.countUserPaymentsHistory(userId);
    if (!paymentCount) {
      return;
    }

    let paymentHistory;
    const cursor = lastItemId ? { id: lastItemId } : undefined;
    skip = lastItemId ? 1 : skip;

    if (paymentHistoryType !== '전체') {
      const paymentType = await this.paymentsRepository.getPaymentProductType(
        paymentHistoryType,
      );

      paymentHistory = await this.paymentsRepository.getUserPaymentHistory(
        userId,
        take,
        skip,
        cursor,
        paymentType.id,
      );
    } else {
      paymentHistory = await this.paymentsRepository.getUserPaymentHistory(
        userId,
        take,
        skip,
        cursor,
      );
    }

    return { paymentCount, paymentHistory };
  }

  async getPaymentVirtualAccount(userId: number, paymentId: number) {
    return await this.paymentsRepository.getPaymentVirtualAccount(
      userId,
      paymentId,
    );
  }
}
