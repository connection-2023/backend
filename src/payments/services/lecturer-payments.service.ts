import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentsRepository } from '@src/payments/repository/payments.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateBankAccountDto } from '@src/payments/dtos/create-bank-account.dto';
import { LecturerBankAccountDto } from '@src/payments/dtos/lecturer-bank-account.dto';
import { PaymentDto } from '../dtos/payment.dto';
import { PaymentRequestDto } from '../dtos/payment-request.dto';
import { Lecture } from '@prisma/client';
import { UpdatePaymentRequestStatusDto } from '../dtos/update-payment-request.dto';
import {
  PaymentOrderStatus,
  PaymentStatusForLecturer,
} from '../enum/payment.enum';
import { PrismaTransaction } from '@src/common/interface/common-interface';

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
    const selectedBankAccount =
      await this.paymentsRepository.getLecturerRecentBankAccount(lecturerId);

    return selectedBankAccount
      ? new LecturerBankAccountDto(selectedBankAccount)
      : null;
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

  async updatePaymentRequestStatus(
    lecturerId: number,
    dto: UpdatePaymentRequestStatusDto,
  ) {
    const { paymentId, status } = dto;
    const selectedPayment = await this.paymentsRepository.getPaymentRequest(
      paymentId,
      lecturerId,
    );

    if (!selectedPayment) {
      throw new BadRequestException(`잘못된 결제 정보입니다.`);
    }

    if (selectedPayment.statusId === status) {
      throw new BadRequestException(`해당 결제 정보는 이미 변경된 상태입니다.`);
    }

    switch (status) {
      case PaymentStatusForLecturer.DONE:
        await this.processPaymentDoneStatus(paymentId);
        break;
      case PaymentStatusForLecturer.REFUSED:
        break;
      case PaymentStatusForLecturer.WAITING_FOR_DEPOSIT:
        break;
    }
  }

  /**
   *
   * @todo done일 때 1. payment done으로 변경  2. isEnabled true
   */
  private async processPaymentDoneStatus(paymentId: number) {
    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        await this.paymentsRepository.trxUpdateLecturePaymentStatus(
          transaction,
          paymentId,
          PaymentStatusForLecturer.DONE,
        );

        await this.paymentsRepository.trxUpdateReservationEnabled(
          transaction,
          paymentId,
        );
      },
    );
  }
}
