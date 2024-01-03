import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadManyLectureSchedule() {
  return applyDecorators(
    ApiOperation({
      summary: '강의 스케쥴 조회',
    }),
    ApiOkResponse(
      SwaggerApiResponse.success('강의 스케쥴 조회완료', {
        statusCode: 200,
        data: {
          schedule: [
            {
              id: 319,
              lectureId: 93,
              startDateTime: '2023-10-03T11:00:00.000Z',
              endDateTime: '2023-10-03T13:00:00.000Z',
              numberOfParticipants: 0,
            },
            {
              id: 320,
              lectureId: 93,
              startDateTime: '2023-10-03T11:00:00.000Z',
              endDateTime: '2023-10-03T13:00:00.000Z',
              numberOfParticipants: 0,
            },
            {
              id: 321,
              lectureId: 93,
              startDateTime: '2023-10-03T11:00:00.000Z',
              endDateTime: '2023-10-03T13:00:00.000Z',
              numberOfParticipants: 0,
            },
          ],
          holidayArr: [
            '2023-10-03T11:00:00.000Z',
            '2023-10-03T11:00:00.000Z',
            '2023-10-03T11:00:00.000Z',
          ],
          daySchedule: [
            {
              id: 1,
              lectureId: 93,
              day: ['월', '수', '금'],
              dateTime: ['13:00:00', '14:00:00'],
            },
            {
              id: 2,
              lectureId: 93,
              day: ['수'],
              dateTime: ['13:00:00'],
            },
          ],
        },
      }),
    ),
  );
}
