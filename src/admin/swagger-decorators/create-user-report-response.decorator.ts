import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UserReportDto } from '@src/common/dtos/use-report.dto';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';

export function ApiCreateUserReportResponse() {
  return applyDecorators(
    ApiOperation({
      summary: '신고 답변',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'userReportResponse',
      UserReportDto,
    ),
  );
}
