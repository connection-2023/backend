import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsRepository } from '@src/payments/repository/payments.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { GetUserPaymentsHistoryDto } from '@src/payments/dtos/get-user-payments-history.dto';

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
    {
      take,
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
      paymentHistoryType,
    }: GetUserPaymentsHistoryDto,
    userId: number,
  ) {
    let paymentType;

    // 전체
    if (paymentHistoryType !== '전체') {
      const paymentProductType =
        await this.paymentsRepository.getPaymentProductType(paymentHistoryType);
      paymentType = paymentProductType?.id;
    }

    if (!targetPage) {
      return await this.paymentsRepository.getUserPaymentHistory(
        userId,
        take,
        paymentType,
      );
    }

    if (currentPage && targetPage) {
      const pageDiff = currentPage - targetPage;

      const { cursor, skip, changedTake } = this.getPaginationOptions(
        pageDiff,
        pageDiff <= -1 ? lastItemId : firstItemId,
        take,
      );

      return await this.paymentsRepository.getUserPaymentHistory(
        userId,
        changedTake,
        paymentType,
        cursor,
        skip,
      );
    }
  }

  private getPaginationOptions(pageDiff: number, itemId: number, take: number) {
    const cursor = { id: itemId };

    const calculateSkipValue = (pageDiff: number) => {
      return Math.abs(pageDiff) === 1 ? 1 : (Math.abs(pageDiff) - 1) * take + 1;
    };

    const skip = calculateSkipValue(pageDiff);

    return { cursor, skip, changedTake: pageDiff >= 1 ? -take : take };
  }

  async getPaymentVirtualAccount(userId: number, paymentId: number) {
    return await this.paymentsRepository.getPaymentVirtualAccount(
      userId,
      paymentId,
    );
  }
}
