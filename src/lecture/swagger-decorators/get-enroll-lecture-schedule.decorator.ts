import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LectureLearnerDto } from '../dtos/lecture-learner.dto';
import { GeneralResponseDto } from '@src/common/swagger/dtos/general-response.dto';
import { EnrollLectureScheduleDto } from '../dtos/get-enroll-schedule.dto';

export function ApiGetEnrollLectureSchedules() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 신청한 클래스 스케쥴 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'enrollSchedules',
      EnrollLectureScheduleDto,
    ),
  );
}
