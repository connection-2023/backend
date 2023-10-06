import { Controller, Get, Query, Res } from '@nestjs/common';
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
    const user: GetUserResponse = await this.authOAuthService.signIn(
      'KAKAO',
      accessToken,
    );

    if (user.userEmail) {
      response
        .status(201)
        .json({ authEmail: user.userEmail, signUpType: 'KAKAO' });
    } else {
      const token: Token = await this.authTokenService.generateToken(
        { userId: user.userId },
        TokenTypes.User,
      );

      response.cookie('refreshToken', token.refreshToken, { httpOnly: true });
      response.status(200).json({ accessToken: token.accessToken });
    }
  }
  @ApiSignInGoogle()
  @Get('/signin/google')
  async signInGoogle(
    @Query('access-token') accessToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user: GetUserResponse = await this.authOAuthService.signIn(
      'GOOGLE',
      accessToken,
    );

    if (user.userEmail) {
      response
        .status(201)
        .json({ authEmail: user.userEmail, signUpType: 'GOOGLE' });
    } else {
      const token: Token = await this.authTokenService.generateToken(
        { userId: user.userId },
        TokenTypes.User,
      );

      response.cookie('refreshToken', token.refreshToken, { httpOnly: true });
      response.status(200).json({ accessToken: token.accessToken });
    }
  }

  @ApiSignInNaver()
  @Get('/signin/naver')
  async signInNaver(
    @Query('access-token') accessToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user: GetUserResponse = await this.authOAuthService.signIn(
      'NAVER',
      accessToken,
    );

    if (user.userEmail) {
      response
        .status(201)
        .json({ authEmail: user.userEmail, signUpType: 'NAVER' });
    } else {
      const token: Token = await this.authTokenService.generateToken(
        { userId: user.userId },
        TokenTypes.User,
      );

      response.cookie('refreshToken', token.refreshToken, { httpOnly: true });
      response.status(200).json({ accessToken: token.accessToken });
    }
  }
}
