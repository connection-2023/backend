import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentsRepository } from '@src/payments/repository/payments.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateBankAccountDto } from '@src/payments/dtos/create-bank-account.dto';
import { LecturerBankAccountDto } from '@src/payments/dtos/lecturer-bank-account.dto';
import { PaymentDto } from '../dtos/payment.dto';
import { PaymentRequestDto } from '../dtos/payment-request.dto';
import { Lecture, Payment, TransferPaymentInfo } from '@prisma/client';
import { UpdatePaymentRequestStatusDto } from '../dtos/update-payment-request.dto';
import {
  PaymentMethods,
  PaymentOrderStatus,
  PaymentStatusForLecturer,
  RefundStatuses,
} from '../enum/payment.enum';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import { IPayment } from '../interface/payments.interface';

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
  ): Promise<void> {
    const { paymentId, status, cancelAmount, refusedReason } = dto;

    //결제 정보 확인
    const payment: IPayment = await this.checkPaymentValidity(
      paymentId,
      lecturerId,
      status,
    );

    switch (status) {
      case PaymentStatusForLecturer.DONE:
        await this.processPaymentDoneStatus(payment.id);
        break;

      case PaymentStatusForLecturer.REFUSED:
        await this.processPaymentRefusedStatus(
          payment,
          cancelAmount,
          refusedReason,
        );
        break;

      case PaymentStatusForLecturer.WAITING_FOR_DEPOSIT:
        break;
    }
  }

  private async checkPaymentValidity(
    paymentId: number,
    lecturerId: number,
    status: number,
  ): Promise<IPayment> {
    const selectedPayment: IPayment =
      await this.paymentsRepository.getPaymentRequest(paymentId, lecturerId);

    if (!selectedPayment) {
      throw new BadRequestException(
        `잘못된 결제 정보입니다.`,
        'InvalidPayment',
      );
    }

    //일반결제가 아닌 경우
    if (
      selectedPayment.paymentMethodId !== PaymentMethods.선결제 &&
      selectedPayment.paymentMethodId !== PaymentMethods.현장결제
    ) {
      throw new BadRequestException(
        `해당 결제 정보는 변경이 불가능한 결제 정보입니다.`,
      );
    }

    //승인일때 거절이 들어온 경우 거절일때 승인이 들어온 경우
    if (
      (selectedPayment.statusId === PaymentOrderStatus.DONE &&
        status === PaymentOrderStatus.REFUSED) ||
      (selectedPayment.statusId === PaymentOrderStatus.REFUSED &&
        status === PaymentOrderStatus.DONE)
    ) {
      throw new BadRequestException(
        `해당 결제 정보는 이미 변경된 상태입니다.`,
        'PaymentStatusAlreadyUpdated',
      );
    }

    if (selectedPayment.statusId === status) {
      throw new BadRequestException(
        `해당 결제 정보는 이미 변경된 상태입니다.`,
        'PaymentStatusAlreadyUpdated',
      );
    }

    return selectedPayment;
  }

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

  private async processPaymentRefusedStatus(
    payment: IPayment,
    cancelAmount: number,
    refusedReason: string,
  ): Promise<void> {
    await this.compareCancelAmount(payment, cancelAmount);

    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        await this.paymentsRepository.trxUpdateLecturePaymentStatus(
          transaction,
          payment.id,
          PaymentStatusForLecturer.REFUSED,
        );

        await this.paymentsRepository.trxUpdateTransferPayment(
          transaction,
          payment.id,
          {
            cancelAmount,
            refusedReason,
            refundStatusId: RefundStatuses.PENDING,
          },
        );

        await this.trxRollbackReservationRelatedData(transaction, payment);
      },
    );
  }

  private async compareCancelAmount(
    payment: IPayment,
    clientCancelAmount,
  ): Promise<void> {
    let targetAmount;

    //현장 결제일때는 보증금, 현장일때는 최종 결제 금액 비교
    switch (payment.paymentMethodId) {
      case PaymentMethods.선결제:
        targetAmount = payment.finalPrice;
        break;
      case PaymentMethods.현장결제:
        targetAmount = payment.transferPaymentInfo.noShowDeposit;
        break;
      default:
        throw new BadRequestException(`지원하지 않는 결제 방식입니다.`);
    }

    if (targetAmount !== clientCancelAmount) {
      throw new BadRequestException(`환불금액이 올바르지 않습니다.`);
    }
  }

  private async trxRollbackReservationRelatedData(
    transaction: PrismaTransaction,
    payment: IPayment,
  ) {
    for (const reservation of payment.reservation) {
      await this.paymentsRepository.trxDecrementLectureScheduleParticipants(
        transaction,
        reservation,
      );
    }

    await this.paymentsRepository.trxDecrementLectureLearner(
      transaction,
      payment.userId,
      payment.lecturerId,
      payment.reservation.length,
    );
  }
}
