import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsRepository } from '@src/payments/repository/payments.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { GetUserPaymentsHistoryDto } from '@src/payments/dtos/get-user-payments-history.dto';
import { SaveUserBankAccountDto } from '@src/payments/dtos/save-user-bank-account.dto';
import { UserBankAccountDto } from '@src/payments/dtos/user-bank-account.dto';

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
    let cursor;
    let skip;

    if (paymentHistoryType !== '전체') {
      const paymentProductType =
        await this.paymentsRepository.getPaymentProductType(paymentHistoryType);
      paymentType = paymentProductType?.id;
    }

    const totalItemCount: number =
      await this.paymentsRepository.countUserPaymentsHistory(
        userId,
        paymentType,
      );
    if (!totalItemCount) {
      return { totalItemCount };
    }

    const isPagination = currentPage && targetPage;
    const isInfiniteScroll = lastItemId && take;

    if (isPagination) {
      const pageDiff = currentPage - targetPage;
      ({ cursor, skip, take } = this.getPaginationOptions(
        pageDiff,
        pageDiff <= -1 ? lastItemId : firstItemId,
        take,
      ));
    } else if (isInfiniteScroll) {
      cursor = { id: lastItemId };
      skip = 1;
    }

    const paymentHistory = await this.paymentsRepository.getUserPaymentHistory(
      userId,
      take,
      paymentType,
      cursor,
      skip,
    );

    return { totalItemCount, paymentHistory };
  }

  private getPaginationOptions(pageDiff: number, itemId: number, take: number) {
    const cursor = { id: itemId };

    const calculateSkipValue = (pageDiff: number) => {
      return Math.abs(pageDiff) === 1 ? 1 : (Math.abs(pageDiff) - 1) * take + 1;
    };

    const skip = calculateSkipValue(pageDiff);

    return { cursor, skip, take: pageDiff >= 1 ? -take : take };
  }

  async getPaymentVirtualAccount(userId: number, paymentId: number) {
    return await this.paymentsRepository.getPaymentVirtualAccount(
      userId,
      paymentId,
    );
  }

  async createUserBankAccount(
    userId: number,
    dto: SaveUserBankAccountDto,
  ): Promise<UserBankAccountDto> {
    return new UserBankAccountDto(
      await this.paymentsRepository.createUserBankAccount({ userId, ...dto }),
    );
  }

  async getUserRecentBankAccount(userId: number): Promise<UserBankAccountDto> {
    return new UserBankAccountDto(
      await this.paymentsRepository.getUserRecentBankAccount(userId),
    );
  }
}
