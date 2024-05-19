import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PaymentsRepository } from '@src/payments/repository/payments.repository';
import { GetUserPaymentsHistoryDto } from '@src/payments/dtos/get-user-payments-history.dto';
import { CreateBankAccountDto } from '@src/payments/dtos/create-bank-account.dto';
import { UserBankAccountDto } from '@src/payments/dtos/user-bank-account.dto';
import { IPaginationParams } from '@src/common/interface/common-interface';
import { PaymentHistoryTypes } from '../constants/enum';
import { DetailPaymentInfoDto } from '../dtos/response/detail-payment.dto';
import { plainToInstance } from 'class-transformer';
import { VirtualAccountDepositDetailsDto } from '../dtos/response/virtual-account-deposit-details.dto';
import { generatePaginationParams } from '@src/common/utils/generate-pagination-params';

@Injectable()
export class UserPaymentsService {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  async getUserPaymentsHistory(
    dto: GetUserPaymentsHistoryDto,
    userId: number,
  ): Promise<{
    totalItemCount: Number;
    userPaymentsHistory?: DetailPaymentInfoDto[];
  }> {
    const { paymentHistoryType, ...paginationOptions } = dto;
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
      return { totalItemCount };
    }

    const paginationParams: IPaginationParams =
      generatePaginationParams(paginationOptions);
    const userPaymentsHistory =
      await this.paymentsRepository.getUserPaymentHistory(
        userId,
        paymentTypeId,
        paginationParams,
      );

    return {
      totalItemCount,
      userPaymentsHistory,
    };
  }

  async getVirtualAccountDepositDetails(
    userId: number,
    paymentId: number,
  ): Promise<VirtualAccountDepositDetailsDto> {
    const selectedVirtualPaymentInfo =
      await this.paymentsRepository.getVirtualAccountPayment(userId, paymentId);
    if (!selectedVirtualPaymentInfo) {
      throw new NotFoundException(
        `결제 정보가 존재하지 않습니다.`,
        `PaymentInfoNotFound`,
      );
    }

    return plainToInstance(
      VirtualAccountDepositDetailsDto,
      selectedVirtualPaymentInfo,
    );
  }

  async createUserBankAccount(
    userId: number,
    dto: CreateBankAccountDto,
  ): Promise<UserBankAccountDto> {
    const selectedBankAccount =
      await this.paymentsRepository.createUserBankAccount({ userId, ...dto });

    return plainToInstance(UserBankAccountDto, selectedBankAccount);
  }

  async getUserRecentBankAccount(userId: number): Promise<UserBankAccountDto> {
    const selectedBankAccount =
      await this.paymentsRepository.getUserRecentBankAccount(userId);

    return plainToInstance(UserBankAccountDto, selectedBankAccount);
  }

  async getUserReceipt(
    userId: number,
    orderId: string,
  ): Promise<DetailPaymentInfoDto> {
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

    return plainToInstance(DetailPaymentInfoDto, receipt);
  }
}
