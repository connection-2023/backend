import { applyDecorators } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadManyLikedLecture() {
  return applyDecorators(
    ApiOperation({
      summary: '관심 강의 조회',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('관심 강의 조회완료', {
        statusCode: 200,
        data: {
          likedLecture: [
            {
              id: 1,
              lectureId: 43,
              userId: 1,
              lecture: {
                id: 43,
                lecturerId: 13,
                lectureTypeId: 1,
                lectureMethodId: 1,
                isGroup: true,
                startDate: '2023-11-24T23:38:36.000Z',
                endDate: '2024-11-24T23:38:24.000Z',
                title: '가비쌤과 함께하는 왁킹 클래스',
                introduction: 'ㅂㅂㅂㅂㅂㅂㅂ',
                curriculum:
                  '<p>첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징첫날에 모하징</p>',
                duration: 100,
                difficultyLevel: '상',
                minCapacity: 1,
                maxCapacity: 5,
                reservationDeadline: 11,
                reservationComment: '누구나 가능한!asdas',
                price: 1001150,
                noShowDeposit: null,
                reviewCount: 0,
                stars: 0,
                isActive: true,
                locationDescription: 'ㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇ',
                createdAt: '2023-11-13T04:58:42.482Z',
                updatedAt: '2023-11-13T04:58:42.482Z',
                deletedAt: null,
              },
            },
          ],
        },
      }),
    ),
  );
}
