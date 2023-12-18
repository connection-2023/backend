import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadManyLecturerLike() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 관심 강사 조회',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('관심 강사 조회완료', {
        statusCode: 200,
        data: {
          count: 4,
          lecturerLike: [
            {
              id: 4,
              lecturerId: 23,
              userId: 56,
              lecturer: {
                nickname: '강사',
                affiliation:
                  '바질바질바질질바질바질자비라밥ㅈ답ㅈ답ㅈ답자답ㅈㄷ',
                stars: 0,
                lecturerRegion: [
                  {
                    region: {
                      id: 11,
                      administrativeDistrict: '서울특별시',
                      district: '노원구',
                    },
                  },
                ],
                lecturerDanceGenre: [
                  {
                    id: 53,
                    danceCategoryId: 1,
                    lecturerId: 23,
                    name: null,
                    danceCategory: {
                      genre: 'K-pop',
                    },
                  },
                  {
                    id: 54,
                    danceCategoryId: 2,
                    lecturerId: 23,
                    name: null,
                    danceCategory: {
                      genre: '브레이킹',
                    },
                  },
                  {
                    id: 55,
                    danceCategoryId: 3,
                    lecturerId: 23,
                    name: null,
                    danceCategory: {
                      genre: '팝핑',
                    },
                  },
                  {
                    id: 56,
                    danceCategoryId: 4,
                    lecturerId: 23,
                    name: null,
                    danceCategory: {
                      genre: '락킹',
                    },
                  },
                  {
                    id: 57,
                    danceCategoryId: 5,
                    lecturerId: 23,
                    name: null,
                    danceCategory: {
                      genre: '왁킹',
                    },
                  },
                  {
                    id: 58,
                    danceCategoryId: 6,
                    lecturerId: 23,
                    name: null,
                    danceCategory: {
                      genre: '힙합',
                    },
                  },
                  {
                    id: 59,
                    danceCategoryId: 7,
                    lecturerId: 23,
                    name: null,
                    danceCategory: {
                      genre: '하우스',
                    },
                  },
                  {
                    id: 60,
                    danceCategoryId: 8,
                    lecturerId: 23,
                    name: null,
                    danceCategory: {
                      genre: '크럼프',
                    },
                  },
                  {
                    id: 61,
                    danceCategoryId: 9,
                    lecturerId: 23,
                    name: null,
                    danceCategory: {
                      genre: '보깅',
                    },
                  },
                  {
                    id: 62,
                    danceCategoryId: 10,
                    lecturerId: 23,
                    name: null,
                    danceCategory: {
                      genre: '코레오그래피',
                    },
                  },
                  {
                    id: 63,
                    danceCategoryId: 11,
                    lecturerId: 23,
                    name: null,
                    danceCategory: {
                      genre: '키즈댄스',
                    },
                  },
                ],
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
                affiliation: 'qweqwe',
                stars: 0,
                lecturerRegion: [
                  {
                    region: {
                      id: 27,
                      administrativeDistrict: '부산광역시',
                      district: '서구',
                    },
                  },
                ],
                lecturerDanceGenre: [],
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
                affiliation: 'CJ ent',
                stars: 0,
                lecturerRegion: [
                  {
                    region: {
                      id: 2,
                      administrativeDistrict: '서울특별시',
                      district: '중구',
                    },
                  },
                  {
                    region: {
                      id: 10,
                      administrativeDistrict: '서울특별시',
                      district: '도봉구',
                    },
                  },
                ],
                lecturerDanceGenre: [],
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
                affiliation: 'CJ ent',
                stars: 0,
                lecturerRegion: [
                  {
                    region: {
                      id: 10,
                      administrativeDistrict: '서울특별시',
                      district: '도봉구',
                    },
                  },
                  {
                    region: {
                      id: 229,
                      administrativeDistrict: '서울특별시',
                      district: '전 지역',
                    },
                  },
                  {
                    region: {
                      id: 245,
                      administrativeDistrict: '온라인',
                      district: null,
                    },
                  },
                ],
                lecturerDanceGenre: [],
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
