import { ApiOperator } from '@src/common/types/type';
import { ChatsController } from '../chats.controller';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';

export const ApiChats: ApiOperator<keyof ChatsController> = {
  CountTotalUnreadMessage: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'totalUnreadCount',
        Number,
      ),
    );
  },
  CreateChats: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  GetChats: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  UpdateUnreadMessage: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
};
