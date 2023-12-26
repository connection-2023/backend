import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadManyPopularLectures() {
  return applyDecorators(
    ApiOperation({
      summary: '유저용 인기 강의 조회',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('강의 조회 완료', {
        statusCode: 200,
        data: {
          lectures: [
            {
              id: 59,
              lecturerId: 4,
              lectureTypeId: 1,
              lectureMethodId: 1,
              isGroup: true,
              startDate: '2023-11-24T23:38:40.000Z',
              endDate: '2024-11-24T23:38:27.000Z',
              title: '결제 테스트',
              introduction: '잘 운영할 예정',
              curriculum: '1주차 휴강',
              duration: 2,
              difficultyLevel: '상',
              minCapacity: 1,
              maxCapacity: 10,
              reservationDeadline: 2,
              reservationComment: '유의사항 변경하기!!~~??',
              price: 40000,
              noShowDeposit: 30000,
              reviewCount: 6,
              stars: 4,
              isActive: true,
              locationDescription: '버스타고 한번에 갈 수 있어욤',
              createdAt: '2023-11-24T10:36:30.399Z',
              updatedAt: '2023-12-22T09:48:24.596Z',
              deletedAt: null,
              lecturer: {
                nickname: 'Katieee',
                lecturerProfileImageUrl: [
                  {
                    url: 'https://connection-bucket.s3.amazonaws.com/users/1698177348720_á%C2%84%C2%90á%C2%85©á%C2%84%C2%81á%C2%85¢á%C2%86%C2%BCá%C2%84%C2%8Bá%C2%85µ.jpeg',
                  },
                  {
                    url: 'https://connection-bucket.s3.amazonaws.com/users/1698177348720_á%C2%84%C2%90á%C2%85©á%C2%84%C2%81á%C2%85¢á%C2%86%C2%BCá%C2%84%C2%8Bá%C2%85µ.jpeg',
                  },
                ],
              },
              lectureToDanceGenre: [
                {
                  id: 199,
                  danceCategoryId: 1,
                  lectureId: 59,
                  name: null,
                  danceCategory: {
                    genre: 'K-pop',
                  },
                },
                {
                  id: 200,
                  danceCategoryId: 3,
                  lectureId: 59,
                  name: null,
                  danceCategory: {
                    genre: '팝핑',
                  },
                },
              ],
              lectureToRegion: [
                {
                  region: {
                    administrativeDistrict: '서울특별시',
                    district: '중구',
                  },
                },
              ],
              lectureDay: [],
              likedLecture: [],
            },
            {
              id: 23,
              lecturerId: 3,
              lectureTypeId: 1,
              lectureMethodId: 1,
              isGroup: true,
              startDate: '2023-11-24T23:38:32.000Z',
              endDate: '2023-11-24T23:38:19.000Z',
              title: '가비쌤과 함께하는 왁킹 클래스',
              introduction: '안녕하세용',
              curriculum: '첫날에 모하징',
              duration: 2,
              difficultyLevel: '상',
              minCapacity: 1,
              maxCapacity: 12,
              reservationDeadline: 1,
              reservationComment: '누구나 가능한!',
              price: 40000,
              noShowDeposit: 30000,
              reviewCount: 0,
              stars: 0,
              isActive: true,
              locationDescription: '버스타고 한번에',
              createdAt: '2023-11-06T15:39:19.860Z',
              updatedAt: '2023-11-06T15:39:19.860Z',
              deletedAt: null,
              lecturer: {
                nickname: '올리버쌤',
                lecturerProfileImageUrl: [
                  {
                    url: 'https://connection-bucket.s3.amazonaws.com/users/1698177348720_á%C2%84%C2%90á%C2%85©á%C2%84%C2%81á%C2%85¢á%C2%86%C2%BCá%C2%84%C2%8Bá%C2%85µ.jpeg',
                  },
                  {
                    url: 'https://connection-bucket.s3.amazonaws.com/users/1698177348720_á%C2%84%C2%90á%C2%85©á%C2%84%C2%81á%C2%85¢á%C2%86%C2%BCá%C2%84%C2%8Bá%C2%85µ.jpeg',
                  },
                ],
              },
              lectureToDanceGenre: [
                {
                  id: 53,
                  danceCategoryId: 1,
                  lectureId: 23,
                  name: null,
                  danceCategory: {
                    genre: 'K-pop',
                  },
                },
                {
                  id: 54,
                  danceCategoryId: 3,
                  lectureId: 23,
                  name: null,
                  danceCategory: {
                    genre: '팝핑',
                  },
                },
                {
                  id: 55,
                  danceCategoryId: 12,
                  lectureId: 23,
                  name: '직접입력한 것들',
                  danceCategory: {
                    genre: '기타',
                  },
                },
                {
                  id: 56,
                  danceCategoryId: 12,
                  lectureId: 23,
                  name: '직접입력한 것들',
                  danceCategory: {
                    genre: '기타',
                  },
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
              lectureDay: [],
              likedLecture: [],
            },
            {
              id: 29,
              lecturerId: 3,
              lectureTypeId: 1,
              lectureMethodId: 1,
              isGroup: true,
              startDate: '2023-11-24T23:38:36.000Z',
              endDate: '2024-11-24T23:38:24.000Z',
              title: '가비쌤과 함께하는 왁킹 클래스',
              introduction: '잘 운영할 예정',
              curriculum: '1주차 휴강',
              duration: 2,
              difficultyLevel: '상',
              minCapacity: 1,
              maxCapacity: 5,
              reservationDeadline: 2,
              reservationComment: '신발가져오세요',
              price: 40000,
              noShowDeposit: 30000,
              reviewCount: 0,
              stars: 0,
              isActive: true,
              locationDescription: '버스타고 한번에',
              createdAt: '2023-11-09T04:29:34.085Z',
              updatedAt: '2023-11-09T05:06:31.912Z',
              deletedAt: null,
              lecturer: {
                nickname: '올리버쌤',
                lecturerProfileImageUrl: [
                  {
                    url: 'https://connection-bucket.s3.amazonaws.com/users/1698177348720_á%C2%84%C2%90á%C2%85©á%C2%84%C2%81á%C2%85¢á%C2%86%C2%BCá%C2%84%C2%8Bá%C2%85µ.jpeg',
                  },
                  {
                    url: 'https://connection-bucket.s3.amazonaws.com/users/1698177348720_á%C2%84%C2%90á%C2%85©á%C2%84%C2%81á%C2%85¢á%C2%86%C2%BCá%C2%84%C2%8Bá%C2%85µ.jpeg',
                  },
                ],
              },
              lectureToDanceGenre: [
                {
                  id: 77,
                  danceCategoryId: 1,
                  lectureId: 29,
                  name: null,
                  danceCategory: {
                    genre: 'K-pop',
                  },
                },
                {
                  id: 78,
                  danceCategoryId: 3,
                  lectureId: 29,
                  name: null,
                  danceCategory: {
                    genre: '팝핑',
                  },
                },
                {
                  id: 79,
                  danceCategoryId: 12,
                  lectureId: 29,
                  name: '직접입력한 것들',
                  danceCategory: {
                    genre: '기타',
                  },
                },
                {
                  id: 80,
                  danceCategoryId: 12,
                  lectureId: 29,
                  name: '직접입력한 것들',
                  danceCategory: {
                    genre: '기타',
                  },
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
              lectureDay: [],
              likedLecture: [],
            },
            {
              id: 56,
              lecturerId: 13,
              lectureTypeId: 1,
              lectureMethodId: 1,
              isGroup: true,
              startDate: '2023-11-24T23:38:38.000Z',
              endDate: '2024-11-24T23:38:26.000Z',
              title: '캐싱이 되는 건가?',
              introduction: '안녕하세용',
              curriculum: '첫날에 모하징',
              duration: 2,
              difficultyLevel: '상',
              minCapacity: 1,
              maxCapacity: 12,
              reservationDeadline: 1,
              reservationComment: '누구나 가능한!',
              price: 40000,
              noShowDeposit: 30000,
              reviewCount: 0,
              stars: 0,
              isActive: true,
              locationDescription: '버스타고 한번에',
              createdAt: '2023-11-23T16:58:32.861Z',
              updatedAt: '2023-11-23T16:58:32.861Z',
              deletedAt: null,
              lecturer: {
                nickname: '가나',
                lecturerProfileImageUrl: [
                  {
                    url: 'https://connection-bucket.s3.amazonaws.com/users/1698177348720_á%C2%84%C2%90á%C2%85©á%C2%84%C2%81á%C2%85¢á%C2%86%C2%BCá%C2%84%C2%8Bá%C2%85µ.jpeg',
                  },
                ],
              },
              lectureToDanceGenre: [
                {
                  id: 187,
                  danceCategoryId: 1,
                  lectureId: 56,
                  name: null,
                  danceCategory: {
                    genre: 'K-pop',
                  },
                },
                {
                  id: 188,
                  danceCategoryId: 3,
                  lectureId: 56,
                  name: null,
                  danceCategory: {
                    genre: '팝핑',
                  },
                },
                {
                  id: 189,
                  danceCategoryId: 12,
                  lectureId: 56,
                  name: '직접입력한 것들',
                  danceCategory: {
                    genre: '기타',
                  },
                },
                {
                  id: 190,
                  danceCategoryId: 12,
                  lectureId: 56,
                  name: '직접입력한 것들',
                  danceCategory: {
                    genre: '기타',
                  },
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
              lectureDay: [],
              likedLecture: [
                {
                  id: 12,
                  lectureId: 56,
                  userId: 1,
                },
              ],
            },
            {
              id: 24,
              lecturerId: 3,
              lectureTypeId: 1,
              lectureMethodId: 1,
              isGroup: true,
              startDate: '2023-11-24T23:38:31.000Z',
              endDate: '2023-11-24T23:38:17.000Z',
              title: '가비쌤과 함께하는 왁킹 클래스',
              introduction: '안녕하세용',
              curriculum: '첫날에 모하징',
              duration: 2,
              difficultyLevel: '상',
              minCapacity: 1,
              maxCapacity: 12,
              reservationDeadline: 1,
              reservationComment: '누구나 가능한!',
              price: 40000,
              noShowDeposit: 30000,
              reviewCount: 0,
              stars: 0,
              isActive: true,
              locationDescription: '버스타고 한번에',
              createdAt: '2023-11-06T15:42:45.705Z',
              updatedAt: '2023-11-06T15:42:45.705Z',
              deletedAt: null,
              lecturer: {
                nickname: '올리버쌤',
                lecturerProfileImageUrl: [
                  {
                    url: 'https://connection-bucket.s3.amazonaws.com/users/1698177348720_á%C2%84%C2%90á%C2%85©á%C2%84%C2%81á%C2%85¢á%C2%86%C2%BCá%C2%84%C2%8Bá%C2%85µ.jpeg',
                  },
                  {
                    url: 'https://connection-bucket.s3.amazonaws.com/users/1698177348720_á%C2%84%C2%90á%C2%85©á%C2%84%C2%81á%C2%85¢á%C2%86%C2%BCá%C2%84%C2%8Bá%C2%85µ.jpeg',
                  },
                ],
              },
              lectureToDanceGenre: [
                {
                  id: 57,
                  danceCategoryId: 1,
                  lectureId: 24,
                  name: null,
                  danceCategory: {
                    genre: 'K-pop',
                  },
                },
                {
                  id: 58,
                  danceCategoryId: 3,
                  lectureId: 24,
                  name: null,
                  danceCategory: {
                    genre: '팝핑',
                  },
                },
                {
                  id: 59,
                  danceCategoryId: 12,
                  lectureId: 24,
                  name: '직접입력한 것들',
                  danceCategory: {
                    genre: '기타',
                  },
                },
                {
                  id: 60,
                  danceCategoryId: 12,
                  lectureId: 24,
                  name: '직접입력한 것들',
                  danceCategory: {
                    genre: '기타',
                  },
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
              lectureDay: [],
              likedLecture: [],
            },
          ],
        },
      }),
    ),
  );
}
