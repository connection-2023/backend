import { ApiOperator } from '@src/common/types/type';
import { EventsController } from '../events.controller';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { OnlineMapDto } from '@src/common/dtos/online-map.dto';

export const ApiEvents: ApiOperator<keyof EventsController> = {
  GetOnlineMapWithTargetId: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'onlineMap',
        OnlineMapDto,
      ),
    );
  },
};
