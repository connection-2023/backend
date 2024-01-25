import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentsRepository } from '@src/payments/repository/payments.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateBankAccountDto } from '@src/payments/dtos/create-bank-account.dto';
import { LecturerBankAccountDto } from '@src/payments/dtos/lecturer-bank-account.dto';
import { PaymentDto } from '../dtos/payment.dto';
import { PaymentRequestDto } from '../dtos/payment-request.dto';
import {
  Lecture,
  Payment,
  Reservation,
  TransferPaymentInfo,
} from '@prisma/client';
import { UpdatePaymentRequestStatusDto } from '../dtos/update-payment-request.dto';
import {
  LectureMethod,
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

    //각각의 강의에 해당하는 결제내역들을 합쳐서 반환
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
    const { paymentId, status, cancelAmount, refusedReason, lectureId } = dto;

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
        await this.processPaymentWaitingForDePositStatus(payment, lectureId);
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
        `해당 결제 정보는 변경이 불가능한 결제 방식입니다.`,
        'InvalidPaymentMethod',
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

  private async processPaymentDoneStatus(paymentId: number): Promise<void> {
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
          true,
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

        await this.trxRollbackReservationRelatedData(
          transaction,
          payment,
          false,
        );
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
    }

    if (targetAmount !== clientCancelAmount) {
      throw new BadRequestException(
        `환불금액이 올바르지 않습니다.`,
        'InvalidRefundAmount',
      );
    }
  }

  private async trxRollbackReservationRelatedData(
    transaction: PrismaTransaction,
    payment: IPayment,
    isIncrement: boolean,
    lectureMaxCapacity?: number,
  ): Promise<void> {
    const { reservation } = payment;
    let lectureMethod;
    let numberOfParticipants;
    if (reservation.lectureScheduleId) {
      lectureMethod = LectureMethod.원데이;
      numberOfParticipants = reservation.lectureSchedule.numberOfParticipants;
    } else {
      lectureMethod = LectureMethod.정기;
      numberOfParticipants =
        reservation.regularLectureStatus.numberOfParticipants;
    }

    const trxUpdateParticipantsMethod = isIncrement
      ? this.paymentsRepository.trxIncrementLectureScheduleParticipants
      : this.paymentsRepository.trxDecrementLectureScheduleParticipants;

    const trxUpdateLearnerCountMethod = isIncrement
      ? this.paymentsRepository.trxIncrementLectureLearner
      : this.paymentsRepository.trxDecrementLectureLearner;

    //각 스케쥴의 현재 인원 수정
    //되돌릴 때 신청한 인원이 초과되면 에러 반환 및 롤백 취소
    if (isIncrement && lectureMaxCapacity) {
      const remainingCapacity = lectureMaxCapacity - numberOfParticipants;

      if (remainingCapacity < reservation.participants) {
        throw new BadRequestException(
          `최대 인원 초과로 인해 취소할 수 없습니다.`,
          'ExceededMaxParticipants',
        );
      }
    }

    await trxUpdateParticipantsMethod(transaction, lectureMethod, reservation);

    //수강생의 신청 횟수 수정
    await trxUpdateLearnerCountMethod(
      transaction,
      payment.userId,
      payment.lecturerId,
    );
  }

  private async processPaymentWaitingForDePositStatus(
    payment: IPayment,
    lectureId: number,
  ): Promise<void> {
    switch (payment.statusId) {
      case PaymentOrderStatus.DONE:
        await this.rollbackPaymentDoneStatus(payment.id);
        break;
      case PaymentOrderStatus.REFUSED:
        await this.rollbackPaymentRefusedStatus(payment, lectureId);
        break;
    }
  }

  private async rollbackPaymentDoneStatus(paymentId: number) {
    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        await this.paymentsRepository.trxUpdateLecturePaymentStatus(
          transaction,
          paymentId,
          PaymentStatusForLecturer.WAITING_FOR_DEPOSIT,
        );

        await this.paymentsRepository.trxUpdateReservationEnabled(
          transaction,
          paymentId,
          false,
        );
      },
    );
  }

  private async rollbackPaymentRefusedStatus(
    payment: IPayment,
    lectureId: number,
  ): Promise<void> {
    const lecture: Lecture = await this.paymentsRepository.getLecture(
      lectureId,
    );

    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        await this.paymentsRepository.trxUpdateLecturePaymentStatus(
          transaction,
          payment.id,
          PaymentStatusForLecturer.WAITING_FOR_DEPOSIT,
        );

        await this.paymentsRepository.trxUpdateTransferPayment(
          transaction,
          payment.id,
          {
            refundStatusId: RefundStatuses.NONE,
            cancelAmount: null,
            refusedReason: null,
          },
        );

        await this.trxRollbackReservationRelatedData(
          transaction,
          payment,
          true,
          lecture.maxCapacity,
        );
      },
    );
  }

  async getPaymentRequestCount(lecturerId: number): Promise<number> {
    return await this.paymentsRepository.countLecturerPaymentRequestCount(
      lecturerId,
    );
  }
}
