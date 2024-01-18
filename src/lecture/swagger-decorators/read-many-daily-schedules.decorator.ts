import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadManyDailySchedules() {
  return applyDecorators(
    ApiOperation({
      summary: '강사 특정 날짜 스케쥴 조회',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('강사 특정 날짜 스케쥴 조회', {
        statusCode: 200,
        data: {
          schedules: [
            {
              id: 239,
              lectureId: 59,
              startDateTime: '2023-12-25T01:00:00.000Z',
              endDateTime: '2023-12-25T03:00:00.000Z',
              numberOfParticipants: 6,
              lecture: {
                id: 59,
                title: '결제 테스트',
              },
            },
            {
              id: 240,
              lectureId: 59,
              startDateTime: '2023-12-25T03:00:00.000Z',
              endDateTime: '2023-12-25T05:00:00.000Z',
              numberOfParticipants: 6,
              lecture: {
                id: 59,
                title: '결제 테스트',
              },
            },
            {
              id: 242,
              lectureId: 59,
              startDateTime: '2023-12-25T05:00:00.000Z',
              endDateTime: '2023-12-25T07:00:00.000Z',
              numberOfParticipants: 6,
              lecture: {
                id: 59,
                title: '결제 테스트',
              },
            },
            {
              id: 243,
              lectureId: 59,
              startDateTime: '2023-12-25T09:00:00.000Z',
              endDateTime: '2023-12-25T11:00:00.000Z',
              numberOfParticipants: 6,
              lecture: {
                id: 59,
                title: '결제 테스트',
              },
            },
            {
              id: 241,
              lectureId: 59,
              startDateTime: '2023-12-25T13:00:00.000Z',
              endDateTime: '2023-12-25T15:00:00.000Z',
              numberOfParticipants: 6,
              lecture: {
                id: 59,
                title: '결제 테스트',
              },
            },
          ],
        },
      }),
    ),
  );
}
