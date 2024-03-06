import { StatusResponseDto } from '@src/common/swagger/dtos/status-response.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';

export function ApiUpdateUser() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 수정',
    }),
    ApiBearerAuth(),
    StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'updateUser'),
  );
}
