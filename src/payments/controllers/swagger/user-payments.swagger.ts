import { ApiOperator } from '@src/common/types/type';
import { UserPaymentsController } from '../user-payments.controller';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { ExceptionResponseDto } from '@src/common/swagger/dtos/exeption-response.dto';
import { VirtualAccountDepositDetailsDto } from '@src/payments/dtos/response/virtual-account-deposit-details.dto';

export const ApiUserPayments: ApiOperator<keyof UserPaymentsController> = {
  GetUserPaymentsHistory: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },

  GetUserReceipt: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
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
