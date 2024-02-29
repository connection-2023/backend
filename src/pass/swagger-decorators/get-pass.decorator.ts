import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PassWithLecturerDto } from '../dtos/response/pass-with-lecturer.dto';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';

export function ApiGetPass() {
  return applyDecorators(
    ApiOperation({
      summary: '패스권 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'pass',
      PassWithLecturerDto,
    ),
  );
}
