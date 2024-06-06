import { v4 } from 'uuid';
import request from 'supertest';
import { CreateUserDto } from '@src/user/dtos/create-user.dto';
import { UserController } from '@src/user/controllers/user.controller';
import { ApiResponse } from '@test/types/api-response.type';

/**
 * 유저 생성 테스트
 * 프론트에서 호출한 것과 동일한 유저 생성과정을 수행한다.
 * 이메일, 닉네임, PROVIDER만 선택적으로 받으며 대한 그외 정보는 전부 랜덤으로 생성된다.
 * IServerErrorResponse을 제네릭 타입으로 사용하면 비즈니스 코드의 에러 response를 처리할 수 있다.
 *
 * @param PORT 포트번호
 * @param options [이메일, 닉네임, PROVIDER] OPTIONAL
 * @returns 유저 생성 결과
 */

export const testCreateUser = async <T = unknown>(
  PORT: number,
  options?: Partial<CreateUserDto>,
): Promise<ApiResponse<T, UserController['createUser']>> => {
  const email = options?.email || v4() + '@example.com';
  const url = `http://localhost:${PORT}/users`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      authEmail: email,
      provider: options?.provider || 'KAKAO',
      nickname: options?.nickname || v4().slice(0, 30),
      name: v4().slice(0, 10),
      registerConsents: {
        termsOfService: true,
        talk: true,
        email: true,
        marketing: {
          marketingChannelTalk: true,
          marketingEmail: true,
        },
      },
    }),
  });

  const responseBody: ApiResponse<T, UserController['createUser']> =
    await response.json();

  return responseBody;
};
