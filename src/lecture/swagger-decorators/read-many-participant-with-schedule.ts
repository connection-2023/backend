import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadManyParticipantWithScheduleId() {
  return applyDecorators(
    ApiOperation({
      summary: '강의 해당 회차 수강생 리스트 조회',
    }),
    ApiOkResponse(
      SwaggerApiResponse.success('강의 해당 회차 수강생 리스트 조회 성공', {
        statusCode: 200,
        data: {
          participant: [
            {
              user: {
                nickname: '은서',
                userProfileImage: {
                  id: 1,
                  userId: 56,
                  imageUrl:
                    'https://connection-bucket.s3.amazonaws.com/users/1698177348720_áá©áá¢á¼ááµ.jpeg',
                },
              },
            },
            {
              user: {
                nickname: '은서',
                userProfileImage: {
                  id: 1,
                  userId: 56,
                  imageUrl:
                    'https://connection-bucket.s3.amazonaws.com/users/1698177348720_áá©áá¢á¼ááµ.jpeg',
                },
              },
            },
            {
              user: {
                nickname: '은서',
                userProfileImage: {
                  id: 1,
                  userId: 56,
                  imageUrl:
                    'https://connection-bucket.s3.amazonaws.com/users/1698177348720_áá©áá¢á¼ááµ.jpeg',
                },
              },
            },
            {
              user: {
                nickname: '은서',
                userProfileImage: {
                  id: 1,
                  userId: 56,
                  imageUrl:
                    'https://connection-bucket.s3.amazonaws.com/users/1698177348720_áá©áá¢á¼ááµ.jpeg',
                },
              },
            },
            {
              user: {
                nickname: '은서',
                userProfileImage: {
                  id: 1,
                  userId: 56,
                  imageUrl:
                    'https://connection-bucket.s3.amazonaws.com/users/1698177348720_áá©áá¢á¼ááµ.jpeg',
                },
              },
            },
            {
              user: {
                nickname: '은서',
                userProfileImage: {
                  id: 1,
                  userId: 56,
                  imageUrl:
                    'https://connection-bucket.s3.amazonaws.com/users/1698177348720_áá©áá¢á¼ááµ.jpeg',
                },
              },
            },
            {
              user: {
                nickname: '은서',
                userProfileImage: {
                  id: 1,
                  userId: 56,
                  imageUrl:
                    'https://connection-bucket.s3.amazonaws.com/users/1698177348720_áá©áá¢á¼ááµ.jpeg',
                },
              },
            },
          ],
        },
      }),
    ),
  );
}
