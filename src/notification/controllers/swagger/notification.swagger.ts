import { ApiOperator } from '@src/common/types/type';
import { NotificationController } from '../notification.controller';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { NotificationDto } from '@src/common/dtos/notification.dto';

export const ApiNotification: ApiOperator<keyof NotificationController> = {
  GetMyNotification: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'notifications',
        NotificationDto,
        { isArray: true },
      ),
    );
  },
};
