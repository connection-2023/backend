import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LecturerLearnerPassInfoDto } from '@src/lecturer/dtos/response/lecturer-learner-pass-item';

export function ApiGetLecturerLearnerPassList() {
  return applyDecorators(
    ApiOperation({
      summary: '수강생이 보유한 강사 패스권 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'lecturerLearnerPassList',
      LecturerLearnerPassInfoDto,
      { isArray: true },
    ),
  );
}
