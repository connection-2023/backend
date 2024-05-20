import { ApiOperator } from '@src/common/types/type';
import { LecturerPaymentsController } from '../lecturer-payments.controller';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { ExceptionResponseDto } from '@src/common/swagger/dtos/exeption-response.dto';
import { PaginationResponseDto } from '@src/common/swagger/dtos/pagination-response.dto';
import { LecturerPaymentItemDto } from '@src/payments/dtos/response/lecturer-payment-item.dto';
import { RevenueStatisticDto } from '@src/payments/dtos/response/revenue-statistic.dto';
import { LecturerBankAccountDto } from '@src/payments/dtos/lecturer-bank-account.dto';
import { PaymentRequestDto } from '@src/payments/dtos/payment-request.dto';
import { PassSituationDto } from '@src/payments/dtos/response/pass-situation.dto';
import { StatusResponseDto } from '@src/common/swagger/dtos/status-response.dto';

export const ApiLecturerPayments: ApiOperator<
  keyof LecturerPaymentsController
> = {
  GetLecturerPaymentList: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'lecturerPaymentList',
        LecturerPaymentItemDto,
      ),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.NOT_FOUND, [
        {
          error: 'PaymentInfoNotFound',
          description: '결제 정보가 존재하지 않습니다.',
        },
      ]),
    );
  },

  GetTotalRevenue: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'totalRevenue', Number),
    );
  },

  GetRevenueStatistics: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'revenueStatistics',
        RevenueStatisticDto,
        { isArray: true },
      ),
    );
  },

  GetUserRecentBankAccount: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'lecturerRecentBankAccount',
        LecturerBankAccountDto,
      ),
    );
  },

  CreateLecturerBankAccount: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'createdLecturerBankAccount',
        LecturerBankAccountDto,
      ),
    );
  },

  GetMyPassSituation: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'passSituationList',
        PassSituationDto,
        { isArray: true },
      ),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.NOT_FOUND, [
        {
          error: 'PassNotFound',
          description: '패스권이 존재하지 않습니다.',
        },
      ]),
    );
  },

  // GetPaymentRequestList: (
  //   apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
  //     Partial<OperationObject>,
  // ): PropertyDecorator => {
  //   return applyDecorators(
  //     ApiOperation(apiOperationOptions),
  //     ApiBearerAuth(),
  //     DetailResponseDto.swaggerBuilder(
  //       HttpStatus.OK,
  //       'requestList',
  //       PaymentRequestDto,
  //       { isArray: true },
  //     ),
  //   );
  // },

  // GetPaymentRequestCount: (
  //   apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
  //     Partial<OperationObject>,
  // ): PropertyDecorator => {
  //   return applyDecorators(
  //     ApiOperation(apiOperationOptions),
  //     ApiBearerAuth(),
  //     DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'requestCount', Number),
  //   );
  // },

  // UpdatePaymentRequestStatus: (
  //   apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
  //     Partial<OperationObject>,
  // ): PropertyDecorator => {
  //   return applyDecorators(
  //     ApiOperation(apiOperationOptions),
  //     ApiBearerAuth(),
  //     StatusResponseDto.swaggerBuilder(
  //       HttpStatus.OK,
  //       'updatePaymentRequestResult',
  //     ),
  //     ExceptionResponseDto.swaggerBuilder(HttpStatus.BAD_REQUEST, [
  //       {
  //         error: 'InvalidPayment',
  //         description: '잘못된 결제 정보입니다.',
  //       },
  //       {
  //         error: 'InvalidPaymentMethod',
  //         description: '해당 결제 정보는 변경이 불가능한 결제 방식입니다.',
  //       },
  //       {
  //         error: 'PaymentStatusAlreadyUpdated',
  //         description: '해당 결제 정보는 이미 변경된 상태입니다.',
  //       },
  //       {
  //         error: 'ExceededMaxParticipants',
  //         description: '최대 인원 초과로 인해 취소할 수 없습니다.',
  //       },
  //       {
  //         error: 'InvalidRefundAmount',
  //         description: '환불금액이 올바르지 않습니다.',
  //       },
  //     ]),
  //   );
  // },
};
