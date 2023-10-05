import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthOAuthService } from '../services/auth-oauth.service';
import { AuthTokenService } from '../services/auth-token.service';
import { Token } from '@src/common/interface/common-interface';
import { Response } from 'express';
import { TokenTypes } from '../enums/token-enums';
import { ApiSignInKakao } from '../swagger-decorators/sign-in-kakao-decorators';
import { GetUserResponse } from '../interface/interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('OAuth')
@Controller('auth/oauth')
export class AuthOAuthController {
  constructor(
    private readonly authOAuthService: AuthOAuthService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  @ApiSignInKakao()
  @Get('/signin/kakao')
  async signInKakao(
    @Query('access-token') accessToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user: GetUserResponse = await this.authOAuthService.getUserByKakao(
      accessToken,
    );
    if (user.userEmail) {
      response
        .status(201)
        .json({ authEmail: user.userEmail, signUpType: 'kakao' });
    }

    const token: Token = await this.authTokenService.generateToken(
      { userId: user.userId },
      TokenTypes.User,
    );

    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
    });

    response.status(200).json({ accessToken: token.accessToken });
  }
}
