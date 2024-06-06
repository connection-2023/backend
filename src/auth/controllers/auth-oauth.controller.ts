import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { AuthOAuthService } from '@src/auth/services/auth-oauth.service';
import { AuthTokenService } from '@src/auth/services/auth-token.service';
import { Token } from '@src/common/interface/common-interface';
import { Response } from 'express';
import { TokenTypes } from '@src/auth/enums/token-enums';
import { ApiSignInKakao } from '@src/auth/swagger-decorators/oauth/sign-in-kakao-decorator';
import { GetUserResponse } from '@src/auth/interface/interface';
import { ApiTags } from '@nestjs/swagger';
import { ApiSignInGoogle } from '@src/auth/swagger-decorators/oauth/sign-in-google-decorator';
import { ApiSignInNaver } from '../swagger-decorators/oauth/sign-in-naver-decorator';
import { OAuthProvider } from '../constants/const';
import { ProviderValidator } from '../validators/auth-provider.validator';

@ApiTags('OAuth')
@Controller('auth/oauth')
export class AuthOAuthController {
  constructor(
    private readonly authOAuthService: AuthOAuthService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  @ApiSignInKakao()
  @Get('/signin/:provider')
  async signIn(
    @Query('access-token') accessToken: string,
    @Param('provider', ProviderValidator) provider: OAuthProvider,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user: GetUserResponse = await this.authOAuthService.signIn(
      provider,
      accessToken,
    );

    if (user.userEmail) {
      return {
        statusCode: HttpStatus.CREATED,
        authEmail: user.userEmail,
        signUpType: provider,
      };
    } else {
      const token: Token = await this.authTokenService.generateToken(
        { userId: user.userId },
        TokenTypes.User,
      );

      response.cookie('refreshToken', token.refreshToken, {
        httpOnly: true,
      });

      return { userAccessToken: token.accessToken };
    }
  }
}
