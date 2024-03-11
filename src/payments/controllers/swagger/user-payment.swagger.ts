import { ApiOperator } from '@src/common/types/type';
import { UserPaymentsController } from '../user-payments.controller';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { ExceptionResponseDto } from '@src/common/swagger/dtos/exeption-response.dto';
import { PaymentResultDto } from '@src/payments/dtos/response/payment-result.dto';
import { UserPaymentsHistoryWithCountDto } from '@src/payments/dtos/user-payment-history-list.dto';
import { DetailPaymentInfo } from '@src/payments/dtos/response/detail-payment.dto';
import { PaginationResponseDto } from '@src/common/swagger/dtos/pagination-response.dto';

export const ApiUserPayments: ApiOperator<keyof UserPaymentsController> = {
  GetUserPaymentsHistory: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'userPaymentsHistory',
        DetailPaymentInfo,
      ),
    );
  },

  GetUserReceipt: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'receipt',
        DetailPaymentInfo,
      ),
    );
  },

  GetPaymentVirtualAccount: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  GetUserRecentBankAccount: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  CreateUserBankAccount: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
};
