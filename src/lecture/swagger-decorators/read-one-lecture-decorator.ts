import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadOneLecture() {
  return applyDecorators(
    ApiOperation({
      summary: '강의 상세조회',
    }),
    ApiBearerAuth(),
    ApiCreatedResponse(
      SwaggerApiResponse.success('강의 상세조회 완료', {
        statusCode: 200,
        data: {
          lecture: {
            id: 17,
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
            locationDescription: null,
            createdAt: '2023-11-04T00:26:55.070Z',
            updatedAt: '2023-11-04T00:26:55.070Z',
            deletedAt: null,
            lectureType: {
              name: 'dance',
            },
            lectureMethod: {
              name: '원데이',
            },
            lectureNotification: {
              id: 8,
              lectureId: 17,
              notification: '15일 영업 안합니다요',
              updatedAt: '2023-11-04T00:26:55.070Z',
              deletedAt: null,
            },
            lectureImage: [
              {
                imageUrl: '이미지url1',
              },
              {
                imageUrl: '이미지url2',
              },
            ],
            lectureToRegion: [
              {
                region: {
                  administrativeDistrict: '서울특별시',
                  district: '중구',
                },
              },
              {
                region: {
                  administrativeDistrict: '서울특별시',
                  district: '도봉구',
                },
              },
            ],
            lectureToDanceGenre: [
              {
                name: null,
                danceCategory: {
                  genre: 'K-pop',
                },
              },
              {
                name: null,
                danceCategory: {
                  genre: '팝핑',
                },
              },
              {
                name: '직접입력한 것들',
                danceCategory: {
                  genre: '기타',
                },
              },
              {
                name: '직접입력한 것들',
                danceCategory: {
                  genre: '기타',
                },
              },
            ],
          },
        },
      }),
    ),
  );
}
