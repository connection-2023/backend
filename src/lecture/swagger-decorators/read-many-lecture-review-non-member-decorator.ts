import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadManyLectureReviewNonMember() {
  return applyDecorators(
    ApiOperation({
      summary: '비회원 강사용 강의 리뷰 조회',
    }),
    ApiOkResponse(
      SwaggerApiResponse.success('강의 리뷰 조회완료', {
        statusCode: 200,
        data: {
          review: [
            {
              id: 33,
              lectureId: 59,
              userId: 56,
              reservationId: 27,
              stars: 5,
              description: '별롱',
              createdAt: '2023-11-07T01:45:02.004Z',
              updatedAt: '2023-11-07T02:04:16.215Z',
              deletedAt: null,
              user: {
                id: 56,
                uuid: '9e487d0a-da4b-4420-9aad-52c96ad87248',
                name: '은서',
                nickname: '은서',
                email: 'eunseo2731@gmail.com',
                isProfileOpen: false,
                phoneNumber: null,
                gender: null,
                createdAt: '2023-10-24T19:55:39.173Z',
                updatedAt: '2023-10-24T19:55:39.173Z',
                deletedAt: null,
                profileImage:
                  'https://connection-bucket.s3.amazonaws.com/users/1698177348720_áá©áá¢á¼ááµ.jpeg',
              },
              lectureTitle: '결제 테스트',
              startDateTime: '2023-10-07T11:00:00.000Z',
              count: 0,
            },
            {
              id: 32,
              lectureId: 59,
              userId: 56,
              reservationId: 25,
              stars: 2,
              description: '별롱',
              createdAt: '2023-11-07T01:45:02.003Z',
              updatedAt: '2023-11-07T02:04:16.215Z',
              deletedAt: null,
              user: {
                id: 56,
                uuid: '9e487d0a-da4b-4420-9aad-52c96ad87248',
                name: '은서',
                nickname: '은서',
                email: 'eunseo2731@gmail.com',
                isProfileOpen: false,
                phoneNumber: null,
                gender: null,
                createdAt: '2023-10-24T19:55:39.173Z',
                updatedAt: '2023-10-24T19:55:39.173Z',
                deletedAt: null,
                profileImage:
                  'https://connection-bucket.s3.amazonaws.com/users/1698177348720_áá©áá¢á¼ááµ.jpeg',
              },
              lectureTitle: '결제 테스트',
              startDateTime: '2023-10-07T11:00:00.000Z',
              count: 0,
            },
            {
              id: 30,
              lectureId: 59,
              userId: 56,
              reservationId: 23,
              stars: 4,
              description: '별롱',
              createdAt: '2023-11-07T01:45:02.001Z',
              updatedAt: '2023-11-07T02:04:16.215Z',
              deletedAt: null,
              user: {
                id: 56,
                uuid: '9e487d0a-da4b-4420-9aad-52c96ad87248',
                name: '은서',
                nickname: '은서',
                email: 'eunseo2731@gmail.com',
                isProfileOpen: false,
                phoneNumber: null,
                gender: null,
                createdAt: '2023-10-24T19:55:39.173Z',
                updatedAt: '2023-10-24T19:55:39.173Z',
                deletedAt: null,
                profileImage:
                  'https://connection-bucket.s3.amazonaws.com/users/1698177348720_áá©áá¢á¼ááµ.jpeg',
              },
              lectureTitle: '결제 테스트',
              startDateTime: '2023-10-07T11:00:00.000Z',
              count: 0,
            },
            {
              id: 29,
              lectureId: 59,
              userId: 56,
              reservationId: 22,
              stars: 5,
              description: '별롱',
              createdAt: '2023-11-07T01:45:02.000Z',
              updatedAt: '2023-11-07T02:04:16.215Z',
              deletedAt: null,
              user: {
                id: 56,
                uuid: '9e487d0a-da4b-4420-9aad-52c96ad87248',
                name: '은서',
                nickname: '은서',
                email: 'eunseo2731@gmail.com',
                isProfileOpen: false,
                phoneNumber: null,
                gender: null,
                createdAt: '2023-10-24T19:55:39.173Z',
                updatedAt: '2023-10-24T19:55:39.173Z',
                deletedAt: null,
                profileImage:
                  'https://connection-bucket.s3.amazonaws.com/users/1698177348720_áá©áá¢á¼ááµ.jpeg',
              },
              lectureTitle: '결제 테스트',
              startDateTime: '2023-10-03T11:00:00.000Z',
              count: 5,
            },
            {
              id: 31,
              lectureId: 59,
              userId: 56,
              reservationId: 24,
              stars: 3,
              description: '별롱',
              createdAt: '2023-11-07T01:45:02.002Z',
              updatedAt: '2023-11-07T02:04:16.215Z',
              deletedAt: null,
              user: {
                id: 56,
                uuid: '9e487d0a-da4b-4420-9aad-52c96ad87248',
                name: '은서',
                nickname: '은서',
                email: 'eunseo2731@gmail.com',
                isProfileOpen: false,
                phoneNumber: null,
                gender: null,
                createdAt: '2023-10-24T19:55:39.173Z',
                updatedAt: '2023-10-24T19:55:39.173Z',
                deletedAt: null,
                profileImage:
                  'https://connection-bucket.s3.amazonaws.com/users/1698177348720_áá©áá¢á¼ááµ.jpeg',
              },
              lectureTitle: '결제 테스트',
              startDateTime: '2023-10-03T11:00:00.000Z',
              count: 0,
            },
            {
              id: 34,
              lectureId: 59,
              userId: 56,
              reservationId: 26,
              stars: 5,
              description: '별롱',
              createdAt: '2023-11-07T01:45:02.005Z',
              updatedAt: '2023-11-07T02:04:16.215Z',
              deletedAt: null,
              user: {
                id: 56,
                uuid: '9e487d0a-da4b-4420-9aad-52c96ad87248',
                name: '은서',
                nickname: '은서',
                email: 'eunseo2731@gmail.com',
                isProfileOpen: false,
                phoneNumber: null,
                gender: null,
                createdAt: '2023-10-24T19:55:39.173Z',
                updatedAt: '2023-10-24T19:55:39.173Z',
                deletedAt: null,
                profileImage:
                  'https://connection-bucket.s3.amazonaws.com/users/1698177348720_áá©áá¢á¼ááµ.jpeg',
              },
              lectureTitle: '결제 테스트',
              startDateTime: '2023-10-03T11:00:00.000Z',
              count: 0,
            },
          ],
        },
      }),
    ),
  );
}
