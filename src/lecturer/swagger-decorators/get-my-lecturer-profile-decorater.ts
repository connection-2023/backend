import { ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LecturerDetailProfileDto } from '../dtos/lecturer-detail-profile.dto';

export function ApiGetLecturerProfile() {
  return applyDecorators(
    ApiOperation({
      summary: '강사 프로필 조회',
      description: '프로필 조회',
    }),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'lecturerProfile',
      LecturerDetailProfileDto,
    ),
  );
}
