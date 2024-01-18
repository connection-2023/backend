import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadManyLecturerReviewWithUserId() {
  return applyDecorators(
    ApiOperation({
      summary: '유저용 강사 리뷰 조회',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('리븊 조회 성공', {
        statusCode: 200,
        data: {
          count: 6,
          review: [
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
              reservation: {
                lectureSchedule: {
                  startDateTime: '2023-10-07T11:00:00.000Z',
                  lecture: {
                    title: '가비쌤과 함께하는 왁킹 클래스22',
                  },
                },
              },
              users: {
                nickname: '은서',
                userProfileImage: {
                  imageUrl:
                    'https://connection-bucket.s3.amazonaws.com/users/1698177348720_áá©áá¢á¼ááµ.jpeg',
                },
              },
              likedLectureReview: [
                {
                  id: 27,
                  lectureReviewId: 30,
                  userId: 65,
                },
              ],
              _count: {
                likedLectureReview: 2,
              },
            },
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
              reservation: {
                lectureSchedule: {
                  startDateTime: '2023-10-07T11:00:00.000Z',
                  lecture: {
                    title: '가비쌤과 함께하는 왁킹 클래스22',
                  },
                },
              },
              users: {
                nickname: '은서',
                userProfileImage: {
                  imageUrl:
                    'https://connection-bucket.s3.amazonaws.com/users/1698177348720_áá©áá¢á¼ááµ.jpeg',
                },
              },
              likedLectureReview: [],
              _count: {
                likedLectureReview: 0,
              },
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
              reservation: {
                lectureSchedule: {
                  startDateTime: '2023-10-07T11:00:00.000Z',
                  lecture: {
                    title: '가비쌤과 함께하는 왁킹 클래스22',
                  },
                },
              },
              users: {
                nickname: '은서',
                userProfileImage: {
                  imageUrl:
                    'https://connection-bucket.s3.amazonaws.com/users/1698177348720_áá©áá¢á¼ááµ.jpeg',
                },
              },
              likedLectureReview: [],
              _count: {
                likedLectureReview: 0,
              },
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
              reservation: {
                lectureSchedule: {
                  startDateTime: '2023-10-03T11:00:00.000Z',
                  lecture: {
                    title: '가비쌤과 함께하는 왁킹 클래스22',
                  },
                },
              },
              users: {
                nickname: '은서',
                userProfileImage: {
                  imageUrl:
                    'https://connection-bucket.s3.amazonaws.com/users/1698177348720_áá©áá¢á¼ááµ.jpeg',
                },
              },
              likedLectureReview: [],
              _count: {
                likedLectureReview: 6,
              },
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
              reservation: {
                lectureSchedule: {
                  startDateTime: '2023-10-03T11:00:00.000Z',
                  lecture: {
                    title: '가비쌤과 함께하는 왁킹 클래스22',
                  },
                },
              },
              users: {
                nickname: '은서',
                userProfileImage: {
                  imageUrl:
                    'https://connection-bucket.s3.amazonaws.com/users/1698177348720_áá©áá¢á¼ááµ.jpeg',
                },
              },
              likedLectureReview: [],
              _count: {
                likedLectureReview: 0,
              },
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
              reservation: {
                lectureSchedule: {
                  startDateTime: '2023-10-03T11:00:00.000Z',
                  lecture: {
                    title: '가비쌤과 함께하는 왁킹 클래스22',
                  },
                },
              },
              users: {
                nickname: '은서',
                userProfileImage: {
                  imageUrl:
                    'https://connection-bucket.s3.amazonaws.com/users/1698177348720_áá©áá¢á¼ááµ.jpeg',
                },
              },
              likedLectureReview: [],
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
