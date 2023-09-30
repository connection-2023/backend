import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserTokenPayload } from 'src/common/interface/common-interface';
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
      jwtFromRequest: CookiesTokenExtractor.fromCookies(),
      passReqToCallback: true,
    });
  }

  async validate(request, tokenPayload: UserTokenPayload): Promise<Users> {
    try {
      if (!tokenPayload.userId) {
        throw new UnauthorizedException('잘못된 토큰 형식입니다.');
      }

      const cookiesRefreshToken: string = request.cookies.refreshToken;

      const authorizedUser: Users =
        await this.authTokenService.getUserByPayload(tokenPayload.userId);
      await this.authTokenService.validateRefreshToken(
        cookiesRefreshToken,
        authorizedUser.id,
        TokenTypes.User,
      );

      return authorizedUser;
    } catch (error) {
      throw error;
    }
  }
}
