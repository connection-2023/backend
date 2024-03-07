import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsRepository } from '@src/payments/repository/payments.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { GetUserPaymentsHistoryDto } from '@src/payments/dtos/get-user-payments-history.dto';
import { CreateBankAccountDto } from '@src/payments/dtos/create-bank-account.dto';
import { UserBankAccountDto } from '@src/payments/dtos/user-bank-account.dto';
import { IPaginationParams } from '@src/common/interface/common-interface';
import { PaymentHistoryTypes } from '../constants/enum';
import { UserPaymentsHistoryWithCountDto } from '../dtos/user-payment-history-list.dto';
import { PaymentDto } from '../dtos/payment.dto';

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
  ): Promise<UserPaymentsHistoryWithCountDto> {
    const paymentTypeId =
      paymentHistoryType === PaymentHistoryTypes.전체
        ? undefined
        : paymentHistoryType;

    const totalItemCount: number =
      await this.paymentsRepository.countUserPaymentsHistory(
        userId,
        paymentTypeId,
      );
    if (!totalItemCount) {
      return new UserPaymentsHistoryWithCountDto({ totalItemCount });
    }

    const paginationParams: IPaginationParams = this.getPaginationParams(
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
      take,
    );

    const userPaymentsHistory =
      await this.paymentsRepository.getUserPaymentHistory(
        userId,
        paymentTypeId,
        paginationParams,
      );

    return new UserPaymentsHistoryWithCountDto({
      totalItemCount,
      userPaymentsHistory,
    });
  }

  async getPaymentVirtualAccount(userId: number, paymentId: number) {
    return await this.paymentsRepository.getPaymentVirtualAccount(
      userId,
      paymentId,
    );
  }

  async createUserBankAccount(
    userId: number,
    dto: CreateBankAccountDto,
  ): Promise<UserBankAccountDto> {
    return new UserBankAccountDto(
      await this.paymentsRepository.createUserBankAccount({ userId, ...dto }),
    );
  }

  async getUserRecentBankAccount(userId: number): Promise<UserBankAccountDto> {
    const selectedBankAccount =
      await this.paymentsRepository.getUserRecentBankAccount(userId);

    return selectedBankAccount
      ? new UserBankAccountDto(selectedBankAccount)
      : null;
  }

  private getPaginationParams(
    currentPage: number,
    targetPage: number,
    firstItemId: number,
    lastItemId: number,
    take: number,
  ): IPaginationParams {
    let cursor;
    let skip;
    let updatedTake = take;

    const isPagination = currentPage && targetPage;
    const isInfiniteScroll = lastItemId && take;

    if (isPagination) {
      const pageDiff = currentPage - targetPage;
      cursor = { id: pageDiff <= -1 ? lastItemId : firstItemId };
      skip = Math.abs(pageDiff) === 1 ? 1 : (Math.abs(pageDiff) - 1) * take + 1;
      updatedTake = pageDiff >= 1 ? -take : take;
    } else if (isInfiniteScroll) {
      cursor = { id: lastItemId };
      skip = 1;
    }

    return { cursor, skip, take: updatedTake };
  }

  async getUserReceipt(userId: number, orderId: string): Promise<PaymentDto> {
    const receipt = await this.paymentsRepository.getUserPaymentInfo(
      userId,
      orderId,
    );
    if (!receipt) {
      throw new NotFoundException(
        `결제정보가 존재하지 않습니다.`,
        `NotFoundPaymentInfo`,
      );
    }

    return new PaymentDto(receipt);
  }
}
