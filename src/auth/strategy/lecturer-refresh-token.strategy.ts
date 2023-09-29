import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { LecturerTokenPayload } from 'src/common/interface/common-interface';
import { Lecturer } from '@prisma/client';
import { AuthService } from '@src/auth/services/auth.service';
import { CookiesTokenExtractor } from '@src/auth/extractor/cookie-token-extractor';
import { TokenTypes } from '@src/auth/enums/token-enums';

@Injectable()
export class LecturerRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'lecturerRefreshToken',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
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
        await this.authService.getLecturerByPayload(tokenPayload.lecturerId);

      await this.authService.validateRefreshToken(
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
