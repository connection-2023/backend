import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiCreateLecture() {
  return applyDecorators(
    ApiOperation({
      summary: '강의 생성',
    }),
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),
    ApiCreatedResponse(
      SwaggerApiResponse.success('강의생성완료', {
        statusCode: 201,
        data: {
          newLecture: {
            id: 17,
            lecturerId: 1,
            lectureTypeId: 1,
            lectureMethodId: 1,
            title: '가비쌤과 함께하는 왁킹1',
            introduction: 'dsadasdas',
            curriculum: 'dsadasdsadsadads',
            detailAddress: '용마산로 616 18층',
            duration: 2,
            difficultyLevel: '상',
            minCapacity: 1,
            maxCapacity: 6,
            reservationDeadline: '2023-10-03T00:00:00.000Z',
            reservationComment: 'ddd',
            price: 10000,
            noShowDeposit: 5000,
            reviewCount: 0,
            stars: 0,
            isActive: true,
            createdAt: '2023-10-16T12:21:24.548Z',
            updatedAt: '2023-10-16T12:21:24.548Z',
            deletedAt: null,
          },
        },
      }),
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
