import { ApiOperator } from '@src/common/types/type';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { PassController } from '../pass.controller';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExceptionResponseDto } from '@src/common/swagger/dtos/exeption-response.dto';
import { StatusResponseDto } from '@src/common/swagger/dtos/status-response.dto';

export const ApiPass = {
  // CreateLecturePass: function (
  //   apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
  //     Partial<OperationObject>,
  // ): PropertyDecorator {
  //   throw new Error('Function not implemented.');
  // },
  // GetMyIssuedPassList: function (
  //   apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
  //     Partial<OperationObject>,
  // ): PropertyDecorator {
  //   throw new Error('Function not implemented.');
  // },
  // GetPass: function (
  //   apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
  //     Partial<OperationObject>,
  // ): PropertyDecorator {
  //   throw new Error('Function not implemented.');
  // },
  // GetMyPass: function (
  //   apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
  //     Partial<OperationObject>,
  // ): PropertyDecorator {
  //   throw new Error('Function not implemented.');
  // },
  // GetLecturePasses: function (
  //   apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
  //     Partial<OperationObject>,
  // ): PropertyDecorator {
  //   throw new Error('Function not implemented.');
  // },
  // GetLecturerPasses: function (
  //   apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
  //     Partial<OperationObject>,
  // ): PropertyDecorator {
  //   throw new Error('Function not implemented.');
  // },

  DeactivatePass: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'deactivatePass'),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.NOT_FOUND, [
        {
          error: 'PassNotFound',
          description: '패스권이 존재하지 않습니다.',
        },
      ]),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.FORBIDDEN, [
        {
          error: 'PermissionDenied',
          description: '패스권을 수정할 권한이 없습니다.',
        },
      ]),
    );
  },
};
