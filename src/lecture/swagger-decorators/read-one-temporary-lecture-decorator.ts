import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadOneTemporaryLecture() {
  return applyDecorators(
    ApiOperation({
      summary: '임시저장 불러오기',
    }),
    ApiBearerAuth(),
    ApiCreatedResponse(
      SwaggerApiResponse.success('임시저장 불러오기 완료', {
        statusCode: 200,
        data: {
          temporaryLecture: {
            id: 144,
            lecturerId: 3,
            step: 2,
            lectureTypeId: 1,
            lectureMethodId: 2,
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
            locationDescription: '버스타고 한번에',
            createdAt: '2023-11-15T17:28:16.471Z',
            updatedAt: '2023-11-15T18:05:25.664Z',
            deletedAt: null,
            lectureType: {
              name: 'dance',
            },
            lectureMethod: {
              name: '정기',
            },
            temporaryLecturenotification: {
              notification: '15일 영업 안합니다요',
            },
            temporaryLectureImage: [
              {
                imageUrl: '이미지url1',
              },
              {
                imageUrl: '이미지url2',
              },
            ],
            temporaryLectureCouponTarget: [],
            temporaryLectureToRegion: [
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
            temporaryLectureToDanceGenre: [
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
            temporaryLectureHoliday: [
              {
                holiday: '2023-10-03T11:00:00.000Z',
              },
              {
                holiday: '2023-10-03T11:00:00.000Z',
              },
              {
                holiday: '2023-10-03T11:00:00.000Z',
              },
            ],
          },
          location: {
            id: 47,
            lectureId: 144,
            address: '서울특별시 중랑구 용마산로616',
            detailAddress: '101동 1802호',
            buildingName: '새한아파트',
          },
          temporaryLectureDaySchedule: [
            {
              team: 'A',
              day: ['월', '화'],
              startDateTime: ['13:00', '14:00'],
            },
            {
              team: 'B',
              day: ['월', '화'],
              startDateTime: ['13:00', '14:00'],
            },
            {
              team: 'C',
              day: ['월', '화'],
              startDateTime: ['13:00', '14:00'],
            },
          ],
        },
      }),
    ),
    ApiBadRequestResponse(
      SwaggerApiResponse.exception([
        {
          name: 'UnAuthorizedLecturer',
          example: { message: '접근 권한이 없습니다.' },
        },
      ]),
    ),
  );
}
