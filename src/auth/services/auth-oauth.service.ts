import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import {
  GetUserResponse,
  GoogleUserProfile,
  KakaoUserProfile,
  NaverUserProfile,
} from '@src/auth/interface/interface';
import { SignUpType } from '@src/common/config/sign-up-type.config';
import { Auth } from '@prisma/client';
import { AuthRepository } from '@src/auth/repository/auth.repository';

@Injectable()
export class AuthOAuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthOAuthService.name);
  private kakaoGetUserUri: string;
  private googleGetUserUri: string;
  private naverGetUserUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {}

  onModuleInit() {
    this.kakaoGetUserUri = this.configService.get<string>('KAKAO_GET_USER_URI');
    this.googleGetUserUri = this.configService.get<string>(
      'GOOGLE_GET_USER_URI',
    );
    this.naverGetUserUri = this.configService.get<string>('NAVER_GET_USER_URI');

    this.logger.log('AuthOAuthService init');
  }
  async signIn(
    provider: string,
    accessToken: string,
  ): Promise<GetUserResponse> {
    let userEmail: string;

    if (provider === 'KAKAO') {
      userEmail = await this.getKakaoUserEmail(accessToken);
    } else if (provider === 'GOOGLE') {
      userEmail = await this.getGoogleUserEmail(accessToken);
    } else if (provider === 'NAVER') {
      userEmail = await this.getNaverUserEmail(accessToken);
    }

    const userAuth: Auth = await this.authRepository.getUserAuth(
      userEmail,
      SignUpType[provider],
    );

    if (!userAuth) {
      return { userEmail };
    }

    if (userAuth.signUpType !== SignUpType[provider]) {
      throw new BadRequestException(
        `다른 방식으로 가입된 이메일 입니다.`,
        'alreadyExistEmail',
      );
    }

    return { userId: userAuth.userId };
  }

  private async getKakaoUserEmail(accessToken: string): Promise<string> {
    try {
      const response: AxiosResponse<KakaoUserProfile> = await axios.post(
        this.kakaoGetUserUri,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data.kakao_account.email;
    } catch (error) {
      throw new InternalServerErrorException(
        'OAuth 서버 요청 오류입니다.',
        'oAuthServerError',
      );
    }
  }

  private async getGoogleUserEmail(accessToken: string): Promise<string> {
    try {
      const response: AxiosResponse<GoogleUserProfile> = await axios.get(
        `${this.googleGetUserUri}${accessToken}`,
      );

      return response.data.email;
    } catch (error) {
      throw new InternalServerErrorException(
        'OAuth 서버 요청 오류입니다.',
        'oAuthServerError',
      );
    }
  }

  private async getNaverUserEmail(accessToken: string): Promise<string> {
    try {
      const response: AxiosResponse<NaverUserProfile> = await axios.get(
        this.naverGetUserUri,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      return response.data.response.email;
    } catch (error) {
      throw new InternalServerErrorException(
        'OAuth 서버 요청 오류입니다.',
        'oAuthServerError',
      );
    }
  }
}
