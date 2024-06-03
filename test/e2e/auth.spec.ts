import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@src/app.module';
import axios from 'axios';
import { testUserSignin } from '@test/features/auth/test-user-signin';
import { randomInt } from 'crypto';
import { v4 } from 'uuid';
import { testCreateUser } from '@test/features/user/test-create-user';
import { OAuthProvider } from '@src/auth/constants/const';
import { IServerErrorResponse } from '@test/interface/interface';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AuthOAuthController (e2e)', () => {
  let server: INestApplication;
  const PORT = randomInt(20000, 50000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    server = moduleFixture.createNestApplication();
    await server.init();
    await server.listen(PORT);
  });

  afterAll(async () => {
    await server.close();
  });

  describe('/auth/oauth/signin/:provider (GET)', () => {
    //소셜 로그인 테스트
    it('새로운 사용자일 경우 authEmail을 반환해야 한다', async () => {
      const testEmail = v4() + '@example.com';
      //OAuth Server 통신 모킹(카카오)
      mockedAxios.post.mockResolvedValue({
        data: { kakao_account: { email: testEmail } },
      });
      const response = await testUserSignin(PORT, OAuthProvider.KAKAO);

      expect(response.authEmail).toEqual(testEmail);
    });

    // 기존 사용자일 경우 액세스 토큰을 반환하는 테스트
    it('기존 사용자일 경우 액세스 토큰을 반환해야 한다', async () => {
      const testEmail = v4() + '@example.com';
      await testCreateUser(PORT, {
        provider: OAuthProvider.KAKAO,
        email: testEmail,
      });

      //OAuth Server 통신 모킹(카카오)
      mockedAxios.post.mockResolvedValue({
        data: { kakao_account: { email: testEmail } },
      });
      const response = await testUserSignin(PORT, OAuthProvider.KAKAO);

      expect(response.userAccessToken).toBeDefined();
      expect(typeof response.userAccessToken).toBe('string');
    });

    //비즈니스 로직 에러 테스트
    it('이미 다른 방식으로 가입한 이메일일 경우 에러를 반환해야 한다', async () => {
      const testEmail = v4() + '@example.com';
      await testCreateUser(PORT, {
        provider: OAuthProvider.KAKAO,
        email: testEmail,
      });

      //OAuth Server 통신 모킹(구글)
      mockedAxios.get.mockResolvedValue({
        data: { email: testEmail },
      });
      const response = await testUserSignin<IServerErrorResponse>(
        PORT,
        OAuthProvider.GOOGLE,
      );

      expect(response.statusCode).toBe(400);
      expect(response.error).toBe('differentSignUpMethod');
    });
  });
});
