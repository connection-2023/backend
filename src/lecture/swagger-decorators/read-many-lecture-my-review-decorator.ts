import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadManyLectureMyReview() {
  return applyDecorators(
    ApiOperation({
      summary: '작성한 리뷰 조회',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('작성한 리뷰 조회완료', {
        statusCode: 200,
        data: {
          review: [
            {
              id: 27,
              lectureId: 24,
              userId: 1,
              reservationId: 21,
              stars: 5,
              description: '별롱',
              createdAt: '2023-11-07T01:45:02.487Z',
              updatedAt: '2023-11-07T02:04:16.215Z',
              deletedAt: '2023-11-07T02:04:16.212Z',
              lecture: {
                id: 24,
                lecturerId: 3,
                lectureTypeId: 1,
                lectureMethodId: 1,
                isGroup: true,
                startDate: '2023-11-24T23:38:31.000Z',
                endDate: '2023-11-24T23:38:17.000Z',
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
                createdAt: '2023-11-06T15:42:45.705Z',
                updatedAt: '2023-11-06T15:42:45.705Z',
                deletedAt: null,
              },
              reservation: {
                lectureSchedule: {
                  startDateTime: '2023-10-03T11:00:00.000Z',
                },
              },
              _count: {
                likedLectureReview: 0,
              },
            },
          ],
        },
      }),
    ),
  );
}
