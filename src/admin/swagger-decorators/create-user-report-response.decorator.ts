import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UserReportDto } from '@src/common/dtos/use-report.dto';
import { ApiResponseDto } from '@src/common/swagger/swagger-api-response-dto';

export function ApiCreateUserReportResponse() {
  return applyDecorators(
    ApiOperation({
      summary: '신고 답변',
    }),
    ApiBearerAuth(),
    ApiResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'userReportResponse',
      UserReportDto,
    ),
  );
}
