import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadManyLectureSchedule() {
  return applyDecorators(
    ApiOperation({
      summary: '강의 스케쥴 조회',
    }),
    ApiCreatedResponse(
      SwaggerApiResponse.success('강의 리뷰 조회완료', {
        statusCode: 200,
        data: {
          schedules: [
            {
              id: 57,
              lectureId: 21,
              startDateTime: '2023-10-03T11:00:00.000Z',
              endDateTime: '2023-10-03T13:00:00.000Z',
              numberOfParticipants: 0,
              team: null,
            },
            {
              id: 58,
              lectureId: 21,
              startDateTime: '2023-10-03T11:00:00.000Z',
              endDateTime: '2023-10-03T13:00:00.000Z',
              numberOfParticipants: 0,
              team: null,
            },
            {
              id: 59,
              lectureId: 21,
              startDateTime: '2023-10-03T11:00:00.000Z',
              endDateTime: '2023-10-03T13:00:00.000Z',
              numberOfParticipants: 0,
              team: null,
            },
          ],
        },
      }),
    ),
  );
}
