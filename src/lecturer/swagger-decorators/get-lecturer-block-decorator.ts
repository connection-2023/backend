import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadManyLecturerBlock() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 차단 강사 조회',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('차단 강사 조회완료', {
        statusCode: 200,
        data: {
          count: 4,
          lecturerBlock: [
            {
              id: 4,
              lecturerId: 23,
              userId: 56,
              lecturer: {
                nickname: '강사',
                lecturerProfileImageUrl: [
                  {
                    url: 'https://connection-bucket.s3.amazonaws.com/lecturers/1702626246987_ocean.jpg',
                  },
                ],
              },
            },
            {
              id: 3,
              lecturerId: 13,
              userId: 56,
              lecturer: {
                nickname: '가나',
                lecturerProfileImageUrl: [
                  {
                    url: 'https://connection-bucket.s3.amazonaws.com/users/1698177348720_á%C2%84%C2%90á%C2%85©á%C2%84%C2%81á%C2%85¢á%C2%86%C2%BCá%C2%84%C2%8Bá%C2%85µ.jpeg',
                  },
                ],
              },
            },
            {
              id: 2,
              lecturerId: 4,
              userId: 56,
              lecturer: {
                nickname: 'Katieee',
                lecturerProfileImageUrl: [
                  {
                    url: 'https://connection-bucket.s3.amazonaws.com/users/1698177348720_á%C2%84%C2%90á%C2%85©á%C2%84%C2%81á%C2%85¢á%C2%86%C2%BCá%C2%84%C2%8Bá%C2%85µ.jpeg',
                  },
                ],
              },
            },
            {
              id: 1,
              lecturerId: 3,
              userId: 56,
              lecturer: {
                nickname: '올리버쌤',
                lecturerProfileImageUrl: [
                  {
                    url: 'https://connection-bucket.s3.amazonaws.com/users/1698177348720_á%C2%84%C2%90á%C2%85©á%C2%84%C2%81á%C2%85¢á%C2%86%C2%BCá%C2%84%C2%8Bá%C2%85µ.jpeg',
                  },
                ],
              },
            },
          ],
        },
      }),
    ),
  );
}
