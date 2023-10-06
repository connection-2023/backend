import {
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
} from '@src/auth/interface/interface';
import { PrismaService } from '@src/prisma/prisma.service';
import { SignUpType } from '@src/common/config/sign-up-type.config';
import { Auth } from '@prisma/client';
import { AuthRepository } from '@src/auth/repository/auth.repository';

@Injectable()
export class AuthOAuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthOAuthService.name);
  private kakaoGetUserUri: string;
  private googleGetUserUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly authRepository: AuthRepository,
  ) {}

  onModuleInit() {
    this.kakaoGetUserUri = this.configService.get<string>('KAKAO_GET_USER_URI');
    this.googleGetUserUri = this.configService.get<string>(
      'GOOGLE_GET_USER_URI',
    );

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
    }

    const userAuth: Auth = await this.authRepository.getUserAuth(
      userEmail,
      SignUpType[provider],
    );

    if (!userAuth) {
      return { userEmail };
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
}
