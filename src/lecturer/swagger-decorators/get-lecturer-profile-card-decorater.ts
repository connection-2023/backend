import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiGetLecturerBasicProfile() {
  return applyDecorators(
    ApiOperation({
      summary: '강사 프로필 간략한 정보 조회',
      description: '토큰 필요',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('강사 정보 반환', {
        statusCode: 200,
        data: {
          lecturerBasicProfile: {
            id: 3,
            profileCardImageUrl: 'url',
            nickname: '올리버쌤',
          },
        },
      }),
    ),
  );
}
