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
            id: 1,
            lecturerId: 3,
            lectureTypeId: 1,
            lectureMethodId: 1,
            title: '가비쌤과 함께하는 왁킹 클래스',
            introduction: '안녕하세용',
            curriculum: '첫날에 모하징',
            detailAddress: '용마산로 616 18층',
            duration: 2,
            difficultyLevel: '상',
            minCapacity: 1,
            maxCapacity: 12,
            reservationDeadline: '2023-10-03T00:00:00.000Z',
            reservationComment: '누구나 가능한!',
            price: 40000,
            noShowDeposit: 30000,
            reviewCount: 0,
            stars: 5,
            isActive: true,
            createdAt: '2023-10-23T10:45:36.112Z',
            updatedAt: '2023-10-23T10:45:36.112Z',
            deletedAt: null,
            lecturer: {
              nickname: '올리버쌤',
              lecturerProfileImageUrl: [
                {
                  url: 'url',
                },
                {
                  url: 'url',
                },
              ],
            },
            lectureType: {
              name: 'dance',
            },
            lectureMethod: {
              name: '원데이',
            },
            lectureReview: [
              {
                id: 1,
                userId: 1,
                users: {
                  nickname: 'hyun',
                  userProfileImage: null,
                },
                stars: 5,
                description: '굿굿',
              },
            ],
            lectureNotification: [
              {
                notification: '15일 영업 안합니다요',
              },
            ],
            lectureImage: [
              {
                imageUrl: '이미지url1',
              },
              {
                imageUrl: '이미지url2',
              },
            ],
            lectureCouponTarget: [
              {
                lectureCoupon: {
                  id: 1,
                  lecturerId: 3,
                  title: '쿠포옹',
                  percentage: 10,
                  discountPrice: null,
                  maxDiscountPrice: 10000,
                  maxUsageCount: 3,
                  usageCount: 0,
                  isStackable: true,
                  startAt: '2023-10-31T11:00:00.000Z',
                  endAt: '2023-11-01T11:00:00.000Z',
                },
              },
            ],
            lectureSchedule: [
              {
                startDateTime: '2023-10-03T11:00:00.000Z',
                numberOfParticipants: 0,
                team: null,
              },
              {
                startDateTime: '2023-10-03T11:00:00.000Z',
                numberOfParticipants: 0,
                team: null,
              },
              {
                startDateTime: '2023-10-03T11:00:00.000Z',
                numberOfParticipants: 0,
                team: null,
              },
            ],
            lectureHoliday: [
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
