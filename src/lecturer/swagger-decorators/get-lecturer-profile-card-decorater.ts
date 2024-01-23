import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LecturerBasicProfileDto } from '../dtos/lecturer-basic-profile.dto';

export function ApiGetLecturerBasicProfile() {
  return applyDecorators(
    ApiOperation({
      summary: '강사 프로필 간략한 정보 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'lecturerBasicProfile',
      LecturerBasicProfileDto,
    ),
  );
}
