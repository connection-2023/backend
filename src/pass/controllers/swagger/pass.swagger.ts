import { ApiOperator } from '@src/common/types/type';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { PassController } from '../pass.controller';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExceptionResponseDto } from '@src/common/swagger/dtos/exeption-response.dto';
import { StatusResponseDto } from '@src/common/swagger/dtos/status-response.dto';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LecturePassWithTargetDto } from '@src/common/dtos/lecture-pass-with-target.dto';
import { MyPassDto } from '@src/pass/dtos/pass.dto';
import { PassWithLecturerDto } from '@src/pass/dtos/response/pass-with-lecturer.dto';
import { IssuedPassDto } from '@src/pass/dtos/response/issued-pass.dto';
import { PaginationResponseDto } from '@src/common/swagger/dtos/pagination-response.dto';

export const ApiPass: ApiOperator<keyof PassController> = {
  CreateLecturePass: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      StatusResponseDto.swaggerBuilder(HttpStatus.CREATED, 'createLecturePass'),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.NOT_FOUND, [
        {
          error: 'InvalidClassIncluded',
          description: '유효하지 않은 클래스가 포함되었습니다.',
        },
        {
          error: 'InvalidLecturerInformation',
          description: '유효하지 않은 강사 정보 요청입니다.',
        },
      ]),
    );
  },

  GetMyIssuedPassList: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'passList',
        IssuedPassDto,
      ),
    );
  },

  GetPassById: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'pass',
        PassWithLecturerDto,
      ),
    );
  },

  GetMyPass: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'myPass', MyPassDto),
    );
  },

  GetLecturePasses: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'passList',
        LecturePassWithTargetDto,
        { isArray: true },
      ),
    );
  },

  GetLecturerPasses: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'passList',
        LecturePassWithTargetDto,
        { isArray: true },
      ),
    );
  },

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
