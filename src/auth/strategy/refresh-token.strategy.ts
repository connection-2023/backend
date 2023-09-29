import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserTokenPayload } from 'src/common/interface/common-interface';
import { Users } from '@prisma/client';
import { AuthService } from '../services/auth.service';
import { CookiesTokenExtractor } from '../extractor/cookie-token-extractor';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
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

  async validate(request, tokenPayload: UserTokenPayload): Promise<Users> {
    const cookiesRefreshToken: string = request.cookies.refreshToken;

    const authorizedUser: Users = await this.authService.getUserByPayload(
      tokenPayload.userId,
    );
    await this.authService.validateRefreshToken(
      cookiesRefreshToken,
      authorizedUser.id,
    );

    return authorizedUser;
  }
}
