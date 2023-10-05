import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { KakaoUserProfile } from '../interface/interface';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class AuthOAuthService implements OnModuleInit {
  private kakaoGetUserUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  onModuleInit() {
    this.kakaoGetUserUri = this.configService.get<string>('KAKAO_GET_USER_URI');
  }

  async getUserByKakao(accessToken: string) {
    const userEmail = await this.getKakaoUserEmail(accessToken);

    // const user = await this.prismaService.users.findFirst;
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
