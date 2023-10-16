import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiGetMyLecturerProfile() {
  return applyDecorators(
    ApiOperation({
      summary: '나의 강사 프로필 조회',
      description: '프로필 조회',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('강사 프로필 반환', {
        statusCode: 200,
        data: {
          myLecturerProfile: {
            nickname: '닉네임입니다',
            email: '이메일입니다@naver.com',
            phoneNumber: '01011112222',
            youtubeUrl: '유튜브입니다.',
            instagramUrl: '인스타입니다',
            homepageUrl: '홈페이지입니다',
            affiliation: '소속입니다',
            introduction: '경력입니다',
            experience: '경험입니다',
            lecturerRegion: [
              {
                region: {
                  administrativeDistrict: '서울특별시',
                  district: '도봉구',
                },
              },
              {
                region: {
                  administrativeDistrict: '경기도',
                  district: '광명시',
                },
              },
            ],
            lecturerDanceGenre: [
              {
                name: null,
                danceCategory: {
                  genre: '힙합',
                },
              },
              {
                name: '순정',
                danceCategory: {
                  genre: '기타',
                },
              },
              {
                name: '기교',
                danceCategory: {
                  genre: '기타',
                },
              },
            ],
            lecturerWebsiteUrl: [
              {
                id: 3,
                lecturerId: 3,
                url: 'ㅁㅇㅁㅇㅁㅇ',
              },
            ],
            lecturerProfileImageUrl: [
              {
                id: 7,
                lecturerId: 3,
                url: 'https://s3.ap-northeast-2.amazonaws.com/connection-bucket/lecturer/3/1697291458203_1.png',
              },
              {
                id: 8,
                lecturerId: 3,
                url: 'https://s3.ap-northeast-2.amazonaws.com/connection-bucket/lecturer/3/1697291458299_2.jpg',
              },
              {
                id: 9,
                lecturerId: 3,
                url: 'https://s3.ap-northeast-2.amazonaws.com/connection-bucket/lecturer/3/1697291458382_3.png',
              },
            ],
          },
        },
      }),
    ),
  );
}
