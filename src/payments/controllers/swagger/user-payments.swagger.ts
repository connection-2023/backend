import { ApiOperator } from '@src/common/types/type';
import { UserPaymentsController } from '../user-payments.controller';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { ExceptionResponseDto } from '@src/common/swagger/dtos/exeption-response.dto';
import { VirtualAccountDepositDetailsDto } from '@src/payments/dtos/response/virtual-account-deposit-details.dto';
import { PaginationResponseDto } from '@src/common/swagger/dtos/pagination-response.dto';
import { DetailPaymentInfoDto } from '@src/payments/dtos/response/detail-payment.dto';
import { UserBankAccountDto } from '@src/payments/dtos/user-bank-account.dto';

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
        DetailPaymentInfoDto,
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
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'receipt',
        DetailPaymentInfoDto,
      ),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.NOT_FOUND, [
        {
          error: 'NotFoundPaymentInfo',
          description: '결제 정보가 존재하지 않습니다.',
        },
      ]),
    );
  },

  GetVirtualAccountDepositDetails: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'virtualAccountDepositDetails',
        VirtualAccountDepositDetailsDto,
      ),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.NOT_FOUND, [
        {
          error: 'PaymentInfoNotFound',
          description: '결제 정보가 존재하지 않습니다.',
        },
      ]),
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
        'userRecentBankAccount',
        UserBankAccountDto,
      ),
    );
  },

  CreateUserBankAccount: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'createdUserBankAccount',
        UserBankAccountDto,
      ),
    );
  },
};
