import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadManyEnrollLecture() {
  return applyDecorators(
    ApiOperation({
      summary: '유저가 신청한 강의 조회',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('강의 조회 완료', {
        statusCode: 200,
        data: {
          count: 49,
          enrollLecture: [
            {
              id: 49,
              orderId: 'g00PWq7oEacRtiWqFfblh',
              orderName: '결제 테스트',
              reservation: [
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T09:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T13:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
              ],
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
              id: 48,
              orderId: 'hOKZKKy-GGKCCD0e3DC_q',
              orderName: '결제 테스트',
              reservation: [
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T09:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T13:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
              ],
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
              id: 47,
              orderId: 'Ml4tWsfCwjlChKvsu4J2k',
              orderName: '결제 테스트',
              reservation: [
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T09:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T13:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
              ],
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
              id: 46,
              orderId: 'bqASmmBJYGMW3raAlLYX1',
              orderName: '결제 테스트',
              reservation: [
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T09:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T13:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
              ],
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
              id: 45,
              orderId: 'QcZ-jjnA9yEUGE-MF_UTP',
              orderName: '결제 테스트',
              reservation: [
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T09:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T13:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
              ],
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
              id: 44,
              orderId: 'JyR8xrPE1PCsTb9YVgoqC',
              orderName: '결제 테스트',
              reservation: [
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T13:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
              ],
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
              id: 43,
              orderId: 'xRqXvwLTmenKQ7N-JGcmp',
              orderName: '결제 테스트',
              reservation: [
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T09:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
              ],
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
              id: 42,
              orderId: 'G1Dt1Z4rCWa70LbOJtH9D',
              orderName: '결제 테스트',
              reservation: [
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T01:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
              ],
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
              id: 41,
              orderId: 'N3arTWOISElUovdDKVhdt',
              orderName: '결제 테스트',
              reservation: [
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T09:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
              ],
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
              id: 40,
              orderId: 'QyBZpJOXjz0CBCe4AyAnP',
              orderName: '결제 테스트',
              reservation: [
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T13:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
              ],
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
              id: 39,
              orderId: 'kNUP5Q_YkZxi80oUpF3Zf',
              orderName: '결제 테스트',
              reservation: [
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T09:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
              ],
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
              id: 38,
              orderId: 'HsS61ZdNSmOM1KwxDZ-Mm',
              orderName: '결제 테스트',
              reservation: [
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T09:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
              ],
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
              id: 37,
              orderId: 'BOupPUXbJuIKdNcazD7Oo',
              orderName: '결제 테스트',
              reservation: [
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T01:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
              ],
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
              id: 36,
              orderId: 'M1mB4chmUpUXh5VMqXOI2',
              orderName: '결제 테스트',
              reservation: [
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T01:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
              ],
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
              id: 35,
              orderId: 'LtCA3imtcDQwRFmBlltZQ',
              orderName: '결제 테스트',
              reservation: [
                {
                  lectureSchedule: {
                    startDateTime: '2023-12-25T01:00:00.000Z',
                    lecture: {
                      id: 59,
                      title: '결제 테스트',
                      lectureImage: [
                        {
                          imageUrl: 'imageUrl',
                        },
                      ],
                    },
                  },
                },
              ],
              lecturer: {
                nickname: 'Katieee',
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
