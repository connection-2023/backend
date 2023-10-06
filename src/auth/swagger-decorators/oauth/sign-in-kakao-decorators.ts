import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiSignInKakao() {
  return applyDecorators(
    ApiOperation({ summary: '카카오 로그인' }),
    ApiOkResponse(
      SwaggerApiResponse.success(
        '카카오 로그인 성공시 accessToken 반환 및 쿠키엔 refreshToken 저장',
        {
          accessToken: '토큰',
        },
      ),
    ),
    ApiCreatedResponse(
      SwaggerApiResponse.success(
        '회원가입이 필요할때 반환. 반환값을 포함하여 유저 생성',
        {
          userEmail: '유저 카카오 이메일',
          signUpType: 'kakao',
        },
      ),
    ),
  );
}
