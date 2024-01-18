import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UserReportDto } from '@src/common/dtos/use-report.dto';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';

export function ApiGetUserReportList() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 신고 목록 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'userReportList',
      UserReportDto,
      { isArray: true },
    ),
  );
}
