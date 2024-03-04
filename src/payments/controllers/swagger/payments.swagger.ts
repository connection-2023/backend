import { ApiOperator } from '@src/common/types/type';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExceptionResponseDto } from '@src/common/swagger/dtos/exeption-response.dto';
import { StatusResponseDto } from '@src/common/swagger/dtos/status-response.dto';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LecturePassWithTargetDto } from '@src/common/dtos/lecture-pass-with-target.dto';
import { MyPassDto } from '@src/pass/dtos/pass.dto';
import { PassWithLecturerDto } from '@src/pass/dtos/response/pass-with-lecturer.dto';
import { IssuedPassDto } from '@src/pass/dtos/response/issued-pass.dto';
import { PaginationResponseDto } from '@src/common/swagger/dtos/pagination-response.dto';
import { PaymentsController } from '../payments.controller';
import { LecturePaymentWithPassUsageDto } from '@src/payments/dtos/response/lecture-payment-with-pass-usage.dto';

export const ApiPayments: ApiOperator<keyof PaymentsController> = {
  CreateLecturePaymentWithToss: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  CreatePassPaymentWithToss: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },

  ConfirmLecturePayment: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      StatusResponseDto.swaggerBuilder(HttpStatus.CREATED, 'handleRefund'),
    );
  },

  CancelPayment: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      StatusResponseDto.swaggerBuilder(HttpStatus.CREATED, 'cancelPayment'),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.BAD_REQUEST, [
        {
          error: 'InvalidCancelStatus',
          description: '취소할 수 없는 상태입니다.',
        },
      ]),
    );
  },

  CreateLecturePaymentWithPass: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'paymentResultByPass',
        LecturePaymentWithPassUsageDto,
      ),
    );
  },

  HandleRefund: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      StatusResponseDto.swaggerBuilder(HttpStatus.CREATED, 'handleRefund'),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.BAD_REQUEST, [
        {
          error: 'InvalidPaymentInformation',
          description: '잘못된 결제 정보입니다.',
        },
        {
          error: 'CannotRefundLectureWithPass',
          description: '패스권으로 결제한 강의는 환불할 수 없습니다.',
        },
        {
          error: 'AlreadyRefunded',
          description: '이미 환불 처리된 결제 정보입니다.',
        },
        {
          error: 'PaymentNotCompleted',
          description: '해당 결제 정보는 결제가 완료되지 않은 결제 정보입니다.',
        },
        {
          error: 'RefundPeriodNotAvailable',
          description: '환불 가능 기간이 아닙니다.',
        },
        {
          error: 'InvalidReservationInformation',
          description: '올바르지 않은 예약 정보입니다.',
        },
        {
          error: 'RefundAmountMismatch',
          description: '환불 가격이 일치하지 않습니다.',
        },
        {
          error: 'RefundAccountRequired',
          description: '환불 계좌가 필요한 결제입니다.',
        },
        {
          error: 'InvalidRefundAccount',
          description: '유효하지 않은 환불 계좌 정보입니다.',
        },
      ]),
    );
  },
  HandleVirtualAccountPaymentStatusWebhook: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
};
