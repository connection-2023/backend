import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiUpdateLecture() {
  return applyDecorators(
    ApiOperation({
      summary: '강의 수정',
    }),
    ApiOkResponse(
      SwaggerApiResponse.success('강의 수정 성공', {
        statusCode: 200,
        data: {
          updatedLecture: {
            id: 66,
            lecturerId: 3,
            lectureTypeId: 1,
            lectureMethodId: 1,
            isGroup: true,
            startDate: '2023-10-02T15:00:00.000Z',
            endDate: '2023-10-02T15:00:00.000Z',
            title: '가비쌤과 함께하는 왁킹 클래스',
            introduction: '안녕하세용',
            curriculum: '첫날에 모하징',
            duration: 2,
            difficultyLevel: '상',
            minCapacity: 1,
            maxCapacity: 12,
            reservationDeadline: 1,
            reservationComment: '누구나 가능한!',
            price: 40000,
            noShowDeposit: 30000,
            reviewCount: 0,
            stars: 0,
            isActive: true,
            locationDescription: '버스타고 한번에',
            createdAt: '2023-12-02T07:06:59.976Z',
            updatedAt: '2023-12-02T07:06:59.976Z',
            deletedAt: null,
            lectureNotification: {
              id: 93,
              lectureId: 66,
              notification: '바뀐 공지',
              updatedAt: '2023-12-05T16:01:35.865Z',
              deletedAt: null,
            },
          },
        },
      }),
    ),
  );
}
