import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiGetLecturerProfileCard() {
  return applyDecorators(
    ApiOperation({
      summary: '강사 프로필 카드 조회',
      description: '프로필 카드 조회',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('강사 프로필 카드 반환', {
        statusCode: 200,
        data: {
          lecturerProfile: {
            statusCode: 200,
            data: {
              myLecturerProfileCard: {
                id: 3,
                profileCardImageUrl: 'url',
                nickname: '올리버쌤',
              },
            },
          },
        },
      }),
    ),
  );
}
