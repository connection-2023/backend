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
            id: 111,
            lecturerId: 3,
            step: 2,
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
            reservationDeadline: 1,
            reservationComment: '누구나 가능한!',
            price: 40000,
            noShowDeposit: 30000,
            locationDescription: '버스타고 한번에',
            createdAt: '2023-11-05T21:52:06.078Z',
            updatedAt: '2023-11-06T13:53:22.769Z',
            deletedAt: null,
            lectureType: {
              name: 'dance',
            },
            lectureMethod: {
              name: '원데이',
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
            temporaryLectureSchedule: [
              {
                id: 43,
                lectureId: 111,
                startDateTime: '2023-10-03T11:00:00.000Z',
                endDateTime: '2023-10-03T13:00:00.000Z',
                numberOfParticipants: 0,
                team: null,
              },
              {
                id: 44,
                lectureId: 111,
                startDateTime: '2023-10-03T11:00:00.000Z',
                endDateTime: '2023-10-03T13:00:00.000Z',
                numberOfParticipants: 0,
                team: null,
              },
              {
                id: 45,
                lectureId: 111,
                startDateTime: '2023-10-03T11:00:00.000Z',
                endDateTime: '2023-10-03T13:00:00.000Z',
                numberOfParticipants: 0,
                team: null,
              },
            ],
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
