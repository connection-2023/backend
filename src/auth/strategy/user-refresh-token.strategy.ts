import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import {
  GetUserResult,
  UserTokenPayload,
  ValidateResult,
} from 'src/common/interface/common-interface';
import { Users } from '@prisma/client';
import { AuthTokenService } from '@src/auth/services/auth-token.service';
import { CookiesTokenExtractor } from '@src/auth/extractor/cookie-token-extractor';
import { TokenTypes } from '@src/auth/enums/token-enums';

@Injectable()
export class UserRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'userRefreshToken',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authTokenService: AuthTokenService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_TOKEN_SECRET_KEY'),
      jwtFromRequest: CookiesTokenExtractor.refreshTokenFromCookies(),
      passReqToCallback: true,
    });
  }

  async validate(
    request,
    tokenPayload: UserTokenPayload,
  ): Promise<ValidateResult> {
    try {
      if (!tokenPayload.userId) {
        throw new UnauthorizedException(
          '잘못된 토큰 형식입니다.',
          'InvalidTokenFormat',
        );
      }

      const cookiesRefreshToken: string = request.cookies.refreshToken;

      const authorizedUser: GetUserResult =
        await this.authTokenService.getUserByPayload(tokenPayload.userId);

      await this.authTokenService.validateRefreshToken(
        cookiesRefreshToken,
        authorizedUser.id,
        TokenTypes.User,
      );

      return { user: authorizedUser };
    } catch (error) {
      throw error;
    }
  }
}
