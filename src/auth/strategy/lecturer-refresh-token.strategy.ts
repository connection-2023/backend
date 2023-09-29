import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { LecturerTokenPayload } from 'src/common/interface/common-interface';
import { Lecturer } from '@prisma/client';
import { AuthTokenService } from '@src/auth/services/auth-token.service';
import { CookiesTokenExtractor } from '@src/auth/extractor/cookie-token-extractor';
import { TokenTypes } from '@src/auth/enums/token-enums';

@Injectable()
export class LecturerRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'lecturerRefreshToken',
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

  async validate(
    request,
    tokenPayload: LecturerTokenPayload,
  ): Promise<Lecturer> {
    try {
      if (!tokenPayload.lecturerId) {
        throw new UnauthorizedException('잘못된 토큰 형식입니다.');
      }

      const cookiesRefreshToken: string = request.cookies.refreshToken;

      const authorizedUser: Lecturer =
        await this.authTokenService.getLecturerByPayload(
          tokenPayload.lecturerId,
        );

      await this.authTokenService.validateRefreshToken(
        cookiesRefreshToken,
        authorizedUser.id,
        TokenTypes.Lecturer,
      );

      return authorizedUser;
    } catch (error) {
      throw error;
    }
  }
}
