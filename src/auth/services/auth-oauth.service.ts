import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import {
  GetUserResponse,
  KakaoUserProfile,
} from '@src/auth/interface/interface';
import { PrismaService } from '@src/prisma/prisma.service';
import { SignUpType } from '@src/common/config/sign-up-type.config';
import { Auth } from '@prisma/client';

@Injectable()
export class AuthOAuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthOAuthService.name);
  private kakaoGetUserUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  onModuleInit() {
    this.kakaoGetUserUri = this.configService.get<string>('KAKAO_GET_USER_URI');
    this.logger.log('AuthOAuthService init');
  }

  async getUserByKakao(accessToken: string): Promise<GetUserResponse> {
    const userEmail: string = await this.getKakaoUserEmail(accessToken);

    const user: Auth = await this.prismaService.auth.findFirst({
      where: { email: userEmail, signUpType: SignUpType.KAKAO },
    });

    if (!user) {
      return { userEmail };
    }

    return { userId: user.userId };
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
      throw new InternalServerErrorException(`카카오 서버 요청 실패`);
    }
  }
}
