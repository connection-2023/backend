import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiSignInKakao() {
  return applyDecorators(
    ApiOperation({ summary: '구글 로그인' }),
    ApiOkResponse(
      SwaggerApiResponse.success(
        '구글 로그인 성공시 accessToken 반환 및 쿠키엔 refreshToken 저장',
        {
          accessToken: '토큰',
        },
      ),
    ),
    ApiCreatedResponse(
      SwaggerApiResponse.success(
        '회원가입이 필요할때 반환. *유저 생성후 Auth 생성 필요*',
        {
          userEmail: '유저 구글 이메일',
          signUpType: 'GOOGLE',
        },
      ),
    ),
    ApiInternalServerErrorResponse(
      SwaggerApiResponse.exception([
        {
          name: 'oAuthServerError',
          example: { message: 'OAuth 서버 요청 오류입니다.' },
        },
      ]),
    ),
  );
}
