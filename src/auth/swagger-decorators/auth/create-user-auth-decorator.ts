import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiCreateUserAuth() {
  return applyDecorators(
    ApiOperation({ summary: 'auth 생성' }),
    ApiCreatedResponse(
      SwaggerApiResponse.success('성공시 로그인 진행', {
        message: 'auth 정보 등록 완료',
      }),
    ),
    ApiBadRequestResponse(
      SwaggerApiResponse.exception([
        {
          name: 'invalidSignUpType',
          example: { message: '잘못된 SignUpType 입니다.' },
        },
        {
          name: 'invalidUserInformation',
          example: { message: '유효하지 않은 유저 정보 요청입니다.' },
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
