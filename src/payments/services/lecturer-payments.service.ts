import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from '@src/payments/repository/payments.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateBankAccountDto } from '@src/payments/dtos/create-bank-account.dto';
import { LecturerBankAccountDto } from '@src/payments/dtos/lecturer-bank-account.dto';

@Injectable()
export class LecturerPaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async createLecturerBankAccount(
    lecturerId: number,
    dto: CreateBankAccountDto,
  ): Promise<LecturerBankAccountDto> {
    return new LecturerBankAccountDto(
      await this.paymentsRepository.createLecturerBankAccount({
        lecturerId,
        ...dto,
      }),
    );
  }

  async getLecturerRecentBankAccount(
    lecturerId: number,
  ): Promise<LecturerBankAccountDto> {
    return new LecturerBankAccountDto(
      await this.paymentsRepository.getLecturerRecentBankAccount(lecturerId),
    );
  }
}
