import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiGetMyReportList() {
  return applyDecorators(
    ApiOperation({
      summary: '신고 목록 조회',
      description: '신고한 목록 조회',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('신고 목록 반환', {
        statusCode: 200,
        data: {
          reportList: [
            {
              id: 26,
              targetUser: null,
              targetLecturer: {
                nickname: '올리버쌤',
              },
              reason: '사람이 이상해요',
              isAnswered: false,
              createdAt: '2023-12-03T15:22:01.512Z',
              updatedAt: '2023-12-03T15:22:01.512Z',
              userReportType: [
                {
                  reportType: {
                    description: '부적절한 내용',
                  },
                },
                {
                  reportType: {
                    description: '허위 정보 기재',
                  },
                },
                {
                  reportType: {
                    description: '저작권 불법 도용',
                  },
                },
              ],
            },
            {
              id: 25,
              targetUser: null,
              targetLecturer: {
                nickname: '올리버쌤',
              },
              reason: '사진이 이상해요',
              isAnswered: false,
              createdAt: '2023-12-03T15:21:47.574Z',
              updatedAt: '2023-12-03T15:21:47.574Z',
              userReportType: [
                {
                  reportType: {
                    description: '부적절한 내용',
                  },
                },
                {
                  reportType: {
                    description: '허위 정보 기재',
                  },
                },
              ],
            },
            {
              id: 24,
              targetUser: null,
              targetLecturer: {
                nickname: '올리버쌤3',
              },
              reason: '사진이 이상해요',
              isAnswered: false,
              createdAt: '2023-12-03T15:21:01.725Z',
              updatedAt: '2023-12-03T15:21:01.725Z',
              userReportType: [
                {
                  reportType: {
                    description: '부적절한 사진 게시',
                  },
                },
                {
                  reportType: {
                    description: '허위 정보 기재',
                  },
                },
              ],
            },
            {
              id: 16,
              targetUser: {
                nickname: '김수ㅜ',
              },
              targetLecturer: null,
              reason: '사진이 이상해요',
              isAnswered: false,
              createdAt: '2023-12-03T15:12:14.750Z',
              updatedAt: '2023-12-03T15:12:14.750Z',
              userReportType: [
                {
                  reportType: {
                    description: '부적절한 사진 게시',
                  },
                },
                {
                  reportType: {
                    description: '허위 정보 기재',
                  },
                },
              ],
            },
            {
              id: 8,
              targetUser: {
                nickname: '김수ㅜ',
              },
              targetLecturer: null,
              reason: '계속 연락해요 ㄷㄷ',
              isAnswered: false,
              createdAt: '2023-12-03T15:32:22.982Z',
              updatedAt: '2023-12-03T15:32:22.982Z',
              lecturerReportType: [
                {
                  reportType: {
                    description: '기타',
                  },
                },
              ],
            },
          ],
        },
      }),
    ),

    ApiUnauthorizedResponse(
      SwaggerApiResponse.exception([
        {
          name: 'InvalidTokenFormat',
          example: { message: '잘못된 토큰 형식입니다.' },
        },
      ]),
    ),
  );
}
