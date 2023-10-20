import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadMyProfile() {
  return applyDecorators(
    ApiOperation({ summary: '내 프로필 조회' }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('프로필 조회 성공', {
        statusCode: 200,
        data: {
          myProfile: {
            id: 19,
            name: '이재현',
            nickname: 'hyun',
            email: 'illppang@naver.com',
            isProfileOpen: true,
            phoneNumber: '01012345678',
            gender: 0,
            createdAt: '2023-10-19T17:02:20.948Z',
            updatedAt: '2023-10-19T17:02:20.948Z',
            deletedAt: null,
            auth: {
              email: 'illppang@naver.com',
              signUpType: 0,
            },
            userProfileImage: null,
          },
        },
      }),
    ),
  );
}
