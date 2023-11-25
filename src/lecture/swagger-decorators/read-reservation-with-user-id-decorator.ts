import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadLectureReservationWithUser() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 id로 신청 존재 여부 조회',
    }),
    ApiBearerAuth(),
    ApiCreatedResponse(
      SwaggerApiResponse.success('신청 존재 여부 성공', {
        statusCode: 200,
      }),
    ),
    ApiNotFoundResponse(
      SwaggerApiResponse.exception([
        {
          name: 'ReservationNotFound',
          example: {
            status: 404,
            message: 'Reservation Not Found',
            error: 'Not Found',
          },
        },
      ]),
    ),
  );
}
