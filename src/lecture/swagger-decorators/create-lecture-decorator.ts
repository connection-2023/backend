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
    ApiCreatedResponse(
      SwaggerApiResponse.success('강의생성완료', {
        statusCode: 201,
        data: {
          newLecture: {
            id: 20,
            lecturerId: 3,
            lectureTypeId: 1,
            lectureMethodId: 1,
            isGroup: true,
            title: '가비쌤과 함께하는 왁킹 클래스',
            introduction: '안녕하세용',
            curriculum: '첫날에 모하징',
            detailAddress: '용마산로 616 18층',
            duration: 2,
            difficultyLevel: '상',
            minCapacity: 1,
            maxCapacity: 12,
            reservationDeadline: 2,
            reservationComment: '누구나 가능한!',
            price: 40000,
            noShowDeposit: 30000,
            reviewCount: 0,
            stars: 0,
            isActive: true,
            locationDescription: '버스타고 한번에',
            createdAt: '2023-11-06T05:01:49.726Z',
            updatedAt: '2023-11-06T05:01:49.726Z',
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
