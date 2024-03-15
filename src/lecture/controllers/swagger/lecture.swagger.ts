import { ApiOperator } from '@src/common/types/type';
import { LectureController } from '../lecture.controller';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { GeneralResponseDto } from '@src/common/swagger/dtos/general-response.dto';
import { CombinedScheduleDto } from '../../dtos/combined-schedule.dto';
import { RegistLectureScheduleDto } from '@src/lecture/dtos/last-regist-schedule.dto';

export const ApiLecture: ApiOperator<keyof LectureController> = {
  GetLectureSchedule: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      GeneralResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'lectureSchedule',
        CombinedScheduleDto,
      ),
    );
  },
  CreateLecture: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  ReadLecturePreview: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  ReadLectureDetail: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  ReadManyLecture: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  DeleteLecture: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  UpdateLecture: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  ReadLectureScheduleLearnerList: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  ReadLectureReservation: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  GetLectureLearnerList: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  ReadManyEnrollLectureWithUserId: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  GetEnrollLectureList: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  ReadManyLectureSchedules: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  ReadManyLectureDailySchedules: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  GetEnrollScheduleDetail: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  GetLastRegistSchedule: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'lastRegistSchedule',
        RegistLectureScheduleDto,
      ),
    );
  },
};
