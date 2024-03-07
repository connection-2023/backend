import { ApiOperator } from '@src/common/types/type';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExceptionResponseDto } from '@src/common/swagger/dtos/exeption-response.dto';
import { StatusResponseDto } from '@src/common/swagger/dtos/status-response.dto';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { PaymentsController } from '../payments.controller';
import { LecturePaymentWithPassUsageDto } from '@src/payments/dtos/response/lecture-payment-with-pass-usage.dto';
import { PendingPaymentInfoDto } from '@src/payments/dtos/pending-payment-info.dto';
import { PaymentDto } from '@src/payments/dtos/payment.dto';
import { PaymentResultDto } from '@src/payments/dtos/response/payment-result.dto';

export const ApiPayments: ApiOperator<keyof PaymentsController> = {
  GetPaymentResult: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'paymentResult',
        PaymentResultDto,
      ),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.NOT_FOUND, [
        {
          error: 'PaymentInfoNotFound',
          description: '결제 정보가 존재하지 않습니다.',
        },
      ]),
    );
  },

  CreateLecturePaymentWithToss: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'pendingPaymentInfo',
        PendingPaymentInfoDto,
      ),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.BAD_REQUEST, [
        {
          error: 'InactiveLecture',
          description: '활성화되지 않은 강의입니다.',
        },
        {
          error: 'PaymentAlreadyExists',
          description: '결제정보가 이미 존재합니다.',
        },
        {
          error: 'CouponLimit',
          description: '쿠폰 사용 제한 횟수를 초과했습니다.',
        },
        {
          error: 'InvalidCoupon',
          description: '쿠폰 적용 대상이 아닙니다.',
        },
        {
          error: 'DuplicateDiscount',
          description: '할인율은 중복적용이 불가능합니다.',
        },
        {
          error: 'ProductPriceMismatch',
          description: '상품 가격이 일치하지 않습니다.',
        },
        {
          error: 'ExpiredDate',
          description: '예약 마감일이 지난 강의입니다.',
        },
      ]),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.NOT_FOUND, [
        {
          error: 'LectureNotFound',
          description: '강의정보가 존재하지 않습니다.',
        },
      ]),
    );
  },

  CreatePassPaymentWithToss: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'pendingPaymentInfo',
        PendingPaymentInfoDto,
      ),

      ExceptionResponseDto.swaggerBuilder(HttpStatus.BAD_REQUEST, [
        {
          error: 'ProductDisabled',
          description: '상품이 판매 중지되었습니다.',
        },
        {
          error: 'ProductPriceMismatch',
          description: '상품 가격이 일치하지 않습니다.',
        },
        {
          error: 'ProductAlreadyPurchased',
          description: '이미 구매한 패스권입니다.',
        },
      ]),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.NOT_FOUND, [
        {
          error: 'PassInfoNotFound',
          description: '패스권 정보가 존재하지 않습니다.',
        },
      ]),
    );
  },

  ConfirmLecturePayment: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      StatusResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'pendingPaymentInfo',
      ),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.BAD_REQUEST, [
        {
          error: 'PaymentAmountMismatch',
          description: '결제 금액이 일치하지 않습니다.',
        },
        {
          error: 'AlreadyApproved',
          description: '이미 승인된 결제 정보입니다.',
        },
        {
          error: 'InvalidPaymentMethod',
          description: '올바르지 않은 결제 방식입니다.',
        },
        {
          error: 'InvalidPaymentStatus',
          description: '결제 진행이 불가능한 상태입니다.',
        },
      ]),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.NOT_FOUND, [
        {
          error: 'PaymentInfoNotFound',
          description: '결제 정보가 존재하지 않습니다.',
        },
      ]),
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
      ExceptionResponseDto.swaggerBuilder(HttpStatus.BAD_REQUEST, [
        {
          error: 'PaymentExists',
          description: '결제정보가 이미 존재합니다.',
        },
        {
          error: 'LectureNotFound',
          description: '강의정보가 존재하지 않습니다.',
        },
        {
          error: 'InactiveLecture',
          description: '활성화되지 않은 강의입니다.',
        },
        {
          error: 'ExceededCapacity',
          description: '인원 초과입니다.',
        },
        {
          error: 'ExpiredDate',
          description: '예약 마감일이 지난 강의입니다.',
        },
        {
          error: 'ExceededPassUsage',
          description: '패스권의 사용 가능 횟수를 초과했습니다.',
        },
        {
          error: 'InvalidPassTarget',
          description: '패스권 적용 대상이 아닙니다.',
        },
        {
          error: 'ExpiredPass',
          description: '사용기간이 만료된 패스권입니다.',
        },
      ]),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.NOT_FOUND, [
        {
          error: 'LectureNotFound',
          description: '강의정보가 존재하지 않습니다.',
        },
        {
          error: 'LectureScheduleNotFound',
          description: '해당 강의 일정이 존재하지 않습니다.',
        },
        {
          error: 'PassNotFound',
          description: '패스권이 존재하지 않습니다.',
        },
      ]),
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

  HandleVirtualAccountPaymentStatusWebhook: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      StatusResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'handleVirtualAccountPaymentStatusWebhook',
      ),
    );
  },
};
