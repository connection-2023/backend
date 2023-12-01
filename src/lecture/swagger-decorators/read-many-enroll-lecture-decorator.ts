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
        data: [
          {
            id: 22,
            orderId: 'MENH-Xzqla107nXAECT',
            orderName: '결제 테스트',
            reservation: [
              {
                lectureSchedule: {
                  startDateTime: '2023-12-25T05:00:00.000Z',
                  lecture: {
                    id: 59,
                    title: '결제 테스트',
                    lectureImage: [
                      {
                        imageUrl:
                          'https://connection-bucket.s3.amazonaws.com/users/1698177348720_%C3%A1%C2%84%C2%90%C3%A1%C2%85%C2%A9%C3%A1%C2%84%C2%81%C3%A1%C2%85%C2%A2%C3%A1%C2%86%C2%BC%C3%A1%C2%84%C2%8B%C3%A1%C2%85%C2%B5.jpeg',
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
                  url: 'url',
                },
              ],
            },
          },
          {
            id: 23,
            orderId: 'MENH-Xzqla107nXAECCT',
            orderName: '결제 테스트',
            reservation: [
              {
                lectureSchedule: {
                  startDateTime: '2023-12-25T05:00:00.000Z',
                  lecture: {
                    id: 59,
                    title: '결제 테스트',
                    lectureImage: [
                      {
                        imageUrl:
                          'https://connection-bucket.s3.amazonaws.com/users/1698177348720_%C3%A1%C2%84%C2%90%C3%A1%C2%85%C2%A9%C3%A1%C2%84%C2%81%C3%A1%C2%85%C2%A2%C3%A1%C2%86%C2%BC%C3%A1%C2%84%C2%8B%C3%A1%C2%85%C2%B5.jpeg',
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
                  url: 'url',
                },
              ],
            },
          },
          {
            id: 24,
            orderId: 'MENH-Xzql123a107nXCT123',
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
                        imageUrl:
                          'https://connection-bucket.s3.amazonaws.com/users/1698177348720_%C3%A1%C2%84%C2%90%C3%A1%C2%85%C2%A9%C3%A1%C2%84%C2%81%C3%A1%C2%85%C2%A2%C3%A1%C2%86%C2%BC%C3%A1%C2%84%C2%8B%C3%A1%C2%85%C2%B5.jpeg',
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
                  url: 'url',
                },
              ],
            },
          },
          {
            id: 25,
            orderId: 'x9cF4WBFGfCZHolcZBoDS',
            orderName: '결제 테스트',
            reservation: [
              {
                lectureSchedule: {
                  startDateTime: '2023-12-25T03:00:00.000Z',
                  lecture: {
                    id: 59,
                    title: '결제 테스트',
                    lectureImage: [
                      {
                        imageUrl:
                          'https://connection-bucket.s3.amazonaws.com/users/1698177348720_%C3%A1%C2%84%C2%90%C3%A1%C2%85%C2%A9%C3%A1%C2%84%C2%81%C3%A1%C2%85%C2%A2%C3%A1%C2%86%C2%BC%C3%A1%C2%84%C2%8B%C3%A1%C2%85%C2%B5.jpeg',
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
                  url: 'url',
                },
              ],
            },
          },
          {
            id: 26,
            orderId: 'q409ukhHmJ690eE8q43Pe',
            orderName: '결제 테스트',
            reservation: [
              {
                lectureSchedule: {
                  startDateTime: '2023-12-25T03:00:00.000Z',
                  lecture: {
                    id: 59,
                    title: '결제 테스트',
                    lectureImage: [
                      {
                        imageUrl:
                          'https://connection-bucket.s3.amazonaws.com/users/1698177348720_%C3%A1%C2%84%C2%90%C3%A1%C2%85%C2%A9%C3%A1%C2%84%C2%81%C3%A1%C2%85%C2%A2%C3%A1%C2%86%C2%BC%C3%A1%C2%84%C2%8B%C3%A1%C2%85%C2%B5.jpeg',
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
                  url: 'url',
                },
              ],
            },
          },
          {
            id: 27,
            orderId: 'q_fgR_oi2QWCXelCnrGxe',
            orderName: '결제 테스트',
            reservation: [
              {
                lectureSchedule: {
                  startDateTime: '2023-12-25T03:00:00.000Z',
                  lecture: {
                    id: 59,
                    title: '결제 테스트',
                    lectureImage: [
                      {
                        imageUrl:
                          'https://connection-bucket.s3.amazonaws.com/users/1698177348720_%C3%A1%C2%84%C2%90%C3%A1%C2%85%C2%A9%C3%A1%C2%84%C2%81%C3%A1%C2%85%C2%A2%C3%A1%C2%86%C2%BC%C3%A1%C2%84%C2%8B%C3%A1%C2%85%C2%B5.jpeg',
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
                  url: 'url',
                },
              ],
            },
          },
          {
            id: 28,
            orderId: 'MfidxD8nYIQYCJrouRyPm',
            orderName: '결제 테스트',
            reservation: [
              {
                lectureSchedule: {
                  startDateTime: '2023-12-25T05:00:00.000Z',
                  lecture: {
                    id: 59,
                    title: '결제 테스트',
                    lectureImage: [
                      {
                        imageUrl:
                          'https://connection-bucket.s3.amazonaws.com/users/1698177348720_%C3%A1%C2%84%C2%90%C3%A1%C2%85%C2%A9%C3%A1%C2%84%C2%81%C3%A1%C2%85%C2%A2%C3%A1%C2%86%C2%BC%C3%A1%C2%84%C2%8B%C3%A1%C2%85%C2%B5.jpeg',
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
                  url: 'url',
                },
              ],
            },
          },
          {
            id: 29,
            orderId: 'l8l0PJXNIVgYM_ny0CNFg',
            orderName: '결제 테스트',
            reservation: [
              {
                lectureSchedule: {
                  startDateTime: '2023-12-25T05:00:00.000Z',
                  lecture: {
                    id: 59,
                    title: '결제 테스트',
                    lectureImage: [
                      {
                        imageUrl:
                          'https://connection-bucket.s3.amazonaws.com/users/1698177348720_%C3%A1%C2%84%C2%90%C3%A1%C2%85%C2%A9%C3%A1%C2%84%C2%81%C3%A1%C2%85%C2%A2%C3%A1%C2%86%C2%BC%C3%A1%C2%84%C2%8B%C3%A1%C2%85%C2%B5.jpeg',
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
                  url: 'url',
                },
              ],
            },
          },
          {
            id: 30,
            orderId: '1M-fgypV2lzfHHPJDZ84o',
            orderName: '결제 테스트',
            reservation: [
              {
                lectureSchedule: {
                  startDateTime: '2023-12-25T05:00:00.000Z',
                  lecture: {
                    id: 59,
                    title: '결제 테스트',
                    lectureImage: [
                      {
                        imageUrl:
                          'https://connection-bucket.s3.amazonaws.com/users/1698177348720_%C3%A1%C2%84%C2%90%C3%A1%C2%85%C2%A9%C3%A1%C2%84%C2%81%C3%A1%C2%85%C2%A2%C3%A1%C2%86%C2%BC%C3%A1%C2%84%C2%8B%C3%A1%C2%85%C2%B5.jpeg',
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
                  url: 'url',
                },
              ],
            },
          },
          {
            id: 31,
            orderId: 'XI6oBChILcrxHIfPeoVI_',
            orderName: '결제 테스트',
            reservation: [
              {
                lectureSchedule: {
                  startDateTime: '2023-12-25T05:00:00.000Z',
                  lecture: {
                    id: 59,
                    title: '결제 테스트',
                    lectureImage: [
                      {
                        imageUrl:
                          'https://connection-bucket.s3.amazonaws.com/users/1698177348720_%C3%A1%C2%84%C2%90%C3%A1%C2%85%C2%A9%C3%A1%C2%84%C2%81%C3%A1%C2%85%C2%A2%C3%A1%C2%86%C2%BC%C3%A1%C2%84%C2%8B%C3%A1%C2%85%C2%B5.jpeg',
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
                  url: 'url',
                },
              ],
            },
          },
          {
            id: 32,
            orderId: '_Dp3DzkjcF8OaMiEKqQWh',
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
                        imageUrl:
                          'https://connection-bucket.s3.amazonaws.com/users/1698177348720_%C3%A1%C2%84%C2%90%C3%A1%C2%85%C2%A9%C3%A1%C2%84%C2%81%C3%A1%C2%85%C2%A2%C3%A1%C2%86%C2%BC%C3%A1%C2%84%C2%8B%C3%A1%C2%85%C2%B5.jpeg',
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
                  url: 'url',
                },
              ],
            },
          },
          {
            id: 33,
            orderId: 'onbcEUdXMW41tGf1Tf5qJ',
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
                        imageUrl:
                          'https://connection-bucket.s3.amazonaws.com/users/1698177348720_%C3%A1%C2%84%C2%90%C3%A1%C2%85%C2%A9%C3%A1%C2%84%C2%81%C3%A1%C2%85%C2%A2%C3%A1%C2%86%C2%BC%C3%A1%C2%84%C2%8B%C3%A1%C2%85%C2%B5.jpeg',
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
                  url: 'url',
                },
              ],
            },
          },
          {
            id: 34,
            orderId: 't4_m_-Lf96vOGdjtOpHY-',
            orderName: '결제 테스트',
            reservation: [
              {
                lectureSchedule: {
                  startDateTime: '2023-12-25T05:00:00.000Z',
                  lecture: {
                    id: 59,
                    title: '결제 테스트',
                    lectureImage: [
                      {
                        imageUrl:
                          'https://connection-bucket.s3.amazonaws.com/users/1698177348720_%C3%A1%C2%84%C2%90%C3%A1%C2%85%C2%A9%C3%A1%C2%84%C2%81%C3%A1%C2%85%C2%A2%C3%A1%C2%86%C2%BC%C3%A1%C2%84%C2%8B%C3%A1%C2%85%C2%B5.jpeg',
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
                  url: 'url',
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
                        imageUrl:
                          'https://connection-bucket.s3.amazonaws.com/users/1698177348720_%C3%A1%C2%84%C2%90%C3%A1%C2%85%C2%A9%C3%A1%C2%84%C2%81%C3%A1%C2%85%C2%A2%C3%A1%C2%86%C2%BC%C3%A1%C2%84%C2%8B%C3%A1%C2%85%C2%B5.jpeg',
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
                  url: 'url',
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
                        imageUrl:
                          'https://connection-bucket.s3.amazonaws.com/users/1698177348720_%C3%A1%C2%84%C2%90%C3%A1%C2%85%C2%A9%C3%A1%C2%84%C2%81%C3%A1%C2%85%C2%A2%C3%A1%C2%86%C2%BC%C3%A1%C2%84%C2%8B%C3%A1%C2%85%C2%B5.jpeg',
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
                  url: 'url',
                },
              ],
            },
          },
        ],
      }),
    ),
  );
}
