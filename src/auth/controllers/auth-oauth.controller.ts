import { Controller, Get, Query } from '@nestjs/common';
import { AuthOAuthService } from '../services/auth-oauth.service';
import { AuthTokenService } from '../services/auth-token.service';

@Controller('auth/oauth')
export class AuthOAuthController {
  constructor(
    private readonly authOAuthService: AuthOAuthService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  @Get('/signin/kakao')
  async signInWithKakao(@Query('access-token') accessToken: string) {
    const a = await this.authOAuthService.getUserByKakao(accessToken);
  }
}
