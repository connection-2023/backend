import { ApiOperator } from '@src/common/types/type';
import { UserPassController } from '../user-pass.controller';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaginationResponseDto } from '@src/common/swagger/dtos/pagination-response.dto';
import { UserPassDto } from '@src/common/dtos/user-pass.dto';

export const ApiUserPass: ApiOperator<keyof UserPassController> = {
  GetUserPassList: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'GetMyEventList',
        UserPassDto,
      ),
    );
  },
};
