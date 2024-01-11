import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from '@src/payments/repository/payments.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateBankAccountDto } from '@src/payments/dtos/create-bank-account.dto';
import { LecturerBankAccountDto } from '@src/payments/dtos/lecturer-bank-account.dto';
import { PaymentDto } from '../dtos/payment.dto';
import { PaymentRequestDto } from '../dtos/payment-request.dto';
import { Lecture } from '@prisma/client';

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

  async getPaymentRequestList(
    lecturerId: number,
  ): Promise<PaymentRequestDto[]> {
    const lectureList: Lecture[] =
      await this.paymentsRepository.getLecturerLectureList(lecturerId);

    if (!lectureList || lectureList.length === 0) {
      return [];
    }

    const paymentList = await Promise.all(
      lectureList.map(async (lecture) => {
        const payments =
          await this.paymentsRepository.getPaymentRequestListByLecturerId(
            lecture.id,
          );
        return payments.length > 0 ? { lecture, payments } : null;
      }),
    );

    const finalPaymentList = paymentList.filter((item) => item !== null);

    return finalPaymentList.length > 0
      ? finalPaymentList.map((payment) => new PaymentRequestDto(payment))
      : [];
  }
}
