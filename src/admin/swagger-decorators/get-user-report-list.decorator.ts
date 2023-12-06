import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UserReportDto } from '@src/common/dtos/use-report.dto';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiGetUserReportList() {
  return applyDecorators(
    ApiOperation({
      summary: '신고 조회',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.successWithType('a', UserReportDto, {
        statusCode: 200,
      }),
    ),
  );
}
