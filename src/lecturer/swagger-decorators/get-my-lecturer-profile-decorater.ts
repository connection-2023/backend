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
            profileCardImageUrl: 'url',
            nickname: '올리버쌤2',
            email: 'illppang@naver.com',
            phoneNumber: '01012345678',
            youtubeUrl: 'https://www.youtube.com/',
            instagramUrl: '인스타 주소',
            homepageUrl: '홈페이지 주소',
            affiliation: 'CJ ent',
            introduction: '강사 소개글',
            experience: '강사 경력',
            lecturerRegion: [
              {
                region: {
                  administrativeDistrict: '서울특별시',
                  district: '도봉구',
                },
              },
              {
                region: {
                  administrativeDistrict: '서울특별시',
                  district: '전 지역',
                },
              },
              {
                region: {
                  administrativeDistrict: '온라인',
                  district: null,
                },
              },
            ],
            lecturerDanceGenre: [
              {
                name: null,
                danceCategory: {
                  genre: 'K-pop',
                },
              },
              {
                name: null,
                danceCategory: {
                  genre: '보깅',
                },
              },
              {
                name: '기타일때 직접입력한 것들',
                danceCategory: {
                  genre: '기타',
                },
              },
              {
                name: '기타일때 직접입력한 것들',
                danceCategory: {
                  genre: '기타',
                },
              },
            ],
            lecturerInstagramPostUrl: [
              {
                url: '인스타 글 url',
              },
              {
                url: '인스타 글 url',
              },
            ],
            lecturerProfileImageUrl: [
              {
                url: 'url',
              },
              {
                url: 'url',
              },
            ],
          },
        },
      }),
    ),
  );
}
