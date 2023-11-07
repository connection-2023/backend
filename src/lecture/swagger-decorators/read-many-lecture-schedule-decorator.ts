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
          schedule: [
            {
              id: 69,
              lectureId: 25,
              startDateTime: '2023-10-03T11:00:00.000Z',
              endDateTime: '2023-10-03T13:00:00.000Z',
              numberOfParticipants: 0,
              team: null,
            },
            {
              id: 70,
              lectureId: 25,
              startDateTime: '2023-10-03T11:00:00.000Z',
              endDateTime: '2023-10-03T13:00:00.000Z',
              numberOfParticipants: 0,
              team: null,
            },
            {
              id: 71,
              lectureId: 25,
              startDateTime: '2023-10-03T11:00:00.000Z',
              endDateTime: '2023-10-03T13:00:00.000Z',
              numberOfParticipants: 0,
              team: null,
            },
          ],
          holidayArr: [
            '2023-10-03T11:00:00.000Z',
            '2023-10-03T11:00:00.000Z',
            '2023-10-03T11:00:00.000Z',
          ],
        },
      }),
    ),
  );
}
