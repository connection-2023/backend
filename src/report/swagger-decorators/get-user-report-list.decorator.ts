import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { UserReportDto } from '@src/common/dtos/use-report.dto';

export function ApiGetUserReportList() {
  return applyDecorators(
    ApiOperation({
      summary: '신고 목록 조회',
      description: '신고한 목록 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'reportList',
      UserReportDto,
      {
        isArray: true,
      },
    ),
    ApiUnauthorizedResponse(
      SwaggerApiResponse.exception([
        {
          name: 'InvalidTokenFormat',
          example: { message: '잘못된 토큰 형식입니다.' },
        },
      ]),
    ),
  );
}
