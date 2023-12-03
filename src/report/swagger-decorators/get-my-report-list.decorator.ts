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
              id: 11,
              targetUser: null,
              targetLecturer: {
                nickname: '올리버쌤3',
              },
              reportType: {
                description: '허위 정보 기재',
              },
              reason: '이 사람 나보다 춤 못춤',
              isAnswered: false,
              createdAt: '2023-12-03T09:41:21.574Z',
              updatedAt: '2023-12-03T09:41:21.574Z',
            },
            {
              id: 9,
              targetUser: {
                nickname: '김수ㅜ',
              },
              targetLecturer: null,
              reportType: {
                description: '허위 정보 기재',
              },
              reason: '처리해줘요오유',
              isAnswered: false,
              createdAt: '2023-12-03T09:18:32.929Z',
              updatedAt: '2023-12-03T09:18:32.929Z',
            },
            {
              id: 8,
              targetUser: {
                nickname: '김수ㅜ',
              },
              targetLecturer: null,
              reportType: {
                description: '허위 정보 기재',
              },
              reason: '처리해줘요오유',
              isAnswered: false,
              createdAt: '2023-12-02T17:03:45.041Z',
              updatedAt: '2023-12-02T17:03:45.041Z',
            },
            {
              id: 7,
              targetUser: {
                nickname: '김수ㅜ',
              },
              targetLecturer: null,
              reportType: {
                description: '허위 정보 기재',
              },
              reason: '테스트입니다',
              isAnswered: false,
              createdAt: '2023-12-02T17:03:29.797Z',
              updatedAt: '2023-12-02T17:03:29.797Z',
            },
            {
              id: 6,
              targetUser: {
                nickname: '김수ㅜ',
              },
              targetLecturer: null,
              reportType: {
                description: '허위 정보 기재',
              },
              reason: '테스트입니다',
              isAnswered: false,
              createdAt: '2023-12-02T16:33:34.885Z',
              updatedAt: '2023-12-02T16:33:34.885Z',
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
