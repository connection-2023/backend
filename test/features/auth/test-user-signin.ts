import { OAuthProvider } from '@src/auth/constants/const';
import { AuthOAuthController } from '@src/auth/controllers/auth-oauth.controller';
import { ApiResponse } from '@test/types/api-response.type';
import { v4 } from 'uuid';

/**
 * 유저 OAuth 로그인 테스트
 * 테스트 환경에서는 OAuth 서버와 통신하지 않는다.
 * Axios 요청을 모킹하여 OAuth 프로바이더에 맞게 반환값을 할당해야한다.
 * OAuth Server는 성공한다는 가정하에 비즈니스 로직 성공 보장
 * IServerErrorResponse을 제네릭 타입으로 사용하면 비즈니스 코드의 에러 response를 처리할 수 있다.
 *
 * @param PORT 포트번호
 * @param provider 로그인 할 OAuth provider
 * @returns 로그인에 성공하면 토큰을 발급받는다.
 */
export const testUserSignin = async <T = unknown>(
  PORT: number,
  provider: OAuthProvider,
): Promise<ApiResponse<T, AuthOAuthController['signIn']>> => {
  const accessToken = v4();
  const url = `http://localhost:${PORT}/auth/oauth/signin/${
    provider ?? 'kakao'
  }?access-token=${accessToken}`;

  const response = await fetch(url, {
    method: 'GET',
  });

  const responseBody: ApiResponse<T, AuthOAuthController['signIn']> =
    await response.json();

  return responseBody;
};
