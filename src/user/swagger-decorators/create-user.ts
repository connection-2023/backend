import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiCreateUser() {
  return applyDecorators(
    ApiOperation({ summary: '회원가입' }),
    ApiConsumes('multipart/form-data'),
    ApiOkResponse(
      SwaggerApiResponse.success({
        statusCode: 201,
        data: {
          createUser: {
            id: 13,
            name: '이재현',
            nickname: '3221hyun',
            email: 'i32123llpp3ang@naver.com',
            isProfileOpen: true,
            phoneNumber: null,
            gender: 0,
            createdAt: '2023-10-16T14:59:46.835Z',
            updatedAt: '2023-10-16T14:59:46.835Z',
            deletedAt: null,
          },
          createAuth: {
            id: 9,
            userId: 13,
            email: 'illpp2an3g@naver.com',
            signUpType: 0,
            createdAt: '2023-10-16T14:59:46.835Z',
            deletedAt: null,
          },
          createImage: {
            id: 5,
            userId: 13,
            imageUrl: null,
          },
        },
      }),
    ),
    ApiBadRequestResponse(
      SwaggerApiResponse.exception([
        {
          name: 'alreadyExistEmail',
          example: { message: '사용 중인 이메일입니다.' },
        },
        {
          name: 'alreadyExistNickname',
          example: { message: '사용 중인 닉네임입니다.' },
        },
        {
          name: 'alreadyExistPhoneNumber',
          example: { message: '사용 중인 번호입니다.' },
        },
        {
          name: 'invalidSignUpType',
          example: { message: '잘못된 SignUpType 입니다.' },
        },
        {
          name: 'invalidUserInformation',
          example: { message: '유효하지 않는 유저 정보 요청입니다.' },
        },
        {
          name: 'alreadyExistUser',
          example: { message: '이미 가입되어있는 유저입니다.' },
        },
      ]),
    ),
    ApiNotFoundResponse(
      SwaggerApiResponse.exception([
        {
          name: 'notFoundUser',
          example: { message: '존재하지 않는 유저 데이터입니다.' },
        },
      ]),
    ),
  );
}
