import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadManyEnrollLecture() {
  return applyDecorators(
    ApiOperation({
      summary: '유저가 신청한 강의 조회',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('강의 조회 완료', {
        statusCode: 200,
        data: [
          {
            lectureId: 23,
            title: '가비쌤과 함께하는 왁킹 클래스',
            lecturerId: 3,
            startDateTime: [
              '2023-10-03T11:00:00.000Z',
              '2023-10-03T11:00:00.000Z',
              '2023-10-03T11:00:00.000Z',
            ],
          },
          {
            lectureId: 24,
            title: '가비쌤과 함께하는 왁킹 클래스',
            lecturerId: 3,
            startDateTime: ['2023-10-03T11:00:00.000Z'],
          },
          {
            lectureId: 29,
            title: '가비쌤과 함께하는 왁킹 클래스',
            lecturerId: 3,
            startDateTime: [
              '2023-10-04T12:00:00.000Z',
              '2023-10-04T12:00:00.000Z',
              '2023-10-04T12:00:00.000Z',
            ],
          },
        ],
      }),
    ),
  );
}
