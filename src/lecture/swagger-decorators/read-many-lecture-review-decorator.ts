import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadManyLectureReview() {
  return applyDecorators(
    ApiOperation({
      summary: '강의 리뷰 조회',
    }),
    ApiCreatedResponse(
      SwaggerApiResponse.success('강의 리뷰 조회완료', {
        statusCode: 200,
        data: {
          review: [
            {
              id: 22,
              lectureId: 17,
              userId: 1,
              reservationId: 4,
              stars: 1,
              description: 'ggood',
              reservation: {
                lectureSchedule: {
                  startDateTime: '2023-10-07T09:00:00.000Z',
                },
              },
              users: {
                id: 1,
                uuid: '7ebded62-cb47-4238-a636-543870ab62cd',
                name: '이재현',
                nickname: 'hyun',
                email: 'illppang@naver.com',
                isProfileOpen: true,
                phoneNumber: '01012345678',
                gender: 0,
                createdAt: '2023-10-23T09:25:50.248Z',
                updatedAt: '2023-10-23T09:25:50.248Z',
                deletedAt: null,
                userProfileImage: null,
              },
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
                createdAt: '2023-11-04T00:26:55.070Z',
                updatedAt: '2023-11-04T00:26:55.070Z',
                deletedAt: null,
              },
            },
            {
              id: 21,
              lectureId: 17,
              userId: 1,
              reservationId: 3,
              stars: 2,
              description: 'ggood',
              reservation: {
                lectureSchedule: {
                  startDateTime: '2023-10-03T06:00:00.000Z',
                },
              },
              users: {
                id: 1,
                uuid: '7ebded62-cb47-4238-a636-543870ab62cd',
                name: '이재현',
                nickname: 'hyun',
                email: 'illppang@naver.com',
                isProfileOpen: true,
                phoneNumber: '01012345678',
                gender: 0,
                createdAt: '2023-10-23T09:25:50.248Z',
                updatedAt: '2023-10-23T09:25:50.248Z',
                deletedAt: null,
                userProfileImage: null,
              },
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
                createdAt: '2023-11-04T00:26:55.070Z',
                updatedAt: '2023-11-04T00:26:55.070Z',
                deletedAt: null,
              },
            },
            {
              id: 20,
              lectureId: 17,
              userId: 1,
              reservationId: 2,
              stars: 3,
              description: 'ggood',
              reservation: {
                lectureSchedule: {
                  startDateTime: '2023-10-07T09:00:00.000Z',
                },
              },
              users: {
                id: 1,
                uuid: '7ebded62-cb47-4238-a636-543870ab62cd',
                name: '이재현',
                nickname: 'hyun',
                email: 'illppang@naver.com',
                isProfileOpen: true,
                phoneNumber: '01012345678',
                gender: 0,
                createdAt: '2023-10-23T09:25:50.248Z',
                updatedAt: '2023-10-23T09:25:50.248Z',
                deletedAt: null,
                userProfileImage: null,
              },
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
                createdAt: '2023-11-04T00:26:55.070Z',
                updatedAt: '2023-11-04T00:26:55.070Z',
                deletedAt: null,
              },
            },
            {
              id: 19,
              lectureId: 17,
              userId: 1,
              reservationId: 1,
              stars: 4,
              description: 'ggood',
              reservation: {
                lectureSchedule: {
                  startDateTime: '2023-10-03T06:00:00.000Z',
                },
              },
              users: {
                id: 1,
                uuid: '7ebded62-cb47-4238-a636-543870ab62cd',
                name: '이재현',
                nickname: 'hyun',
                email: 'illppang@naver.com',
                isProfileOpen: true,
                phoneNumber: '01012345678',
                gender: 0,
                createdAt: '2023-10-23T09:25:50.248Z',
                updatedAt: '2023-10-23T09:25:50.248Z',
                deletedAt: null,
                userProfileImage: null,
              },
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
                createdAt: '2023-11-04T00:26:55.070Z',
                updatedAt: '2023-11-04T00:26:55.070Z',
                deletedAt: null,
              },
            },
            {
              id: 1,
              lectureId: 17,
              userId: 1,
              reservationId: 18,
              stars: 5,
              description: 'ggood',
              reservation: {
                lectureSchedule: {
                  startDateTime: '2023-10-03T11:00:00.000Z',
                },
              },
              users: {
                id: 1,
                uuid: '7ebded62-cb47-4238-a636-543870ab62cd',
                name: '이재현',
                nickname: 'hyun',
                email: 'illppang@naver.com',
                isProfileOpen: true,
                phoneNumber: '01012345678',
                gender: 0,
                createdAt: '2023-10-23T09:25:50.248Z',
                updatedAt: '2023-10-23T09:25:50.248Z',
                deletedAt: null,
                userProfileImage: null,
              },
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
                createdAt: '2023-11-04T00:26:55.070Z',
                updatedAt: '2023-11-04T00:26:55.070Z',
                deletedAt: null,
              },
            },
          ],
        },
      }),
    ),
  );
}
