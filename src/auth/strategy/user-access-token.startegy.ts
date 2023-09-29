import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Users } from '@prisma/client';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { UserTokenPayload } from '@src/common/interface/common-interface';
import { AuthService } from '@src/auth/services/auth.service';

@Injectable()
export class UserAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'userAccessToken',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_TOKEN_SECRET_KEY'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(tokenPayload: UserTokenPayload): Promise<Users> {
    try {
      if (!tokenPayload.userId) {
        throw new UnauthorizedException('잘못된 토큰 형식입니다.');
      }
      const authorizedUser: Users = await this.authService.getUserByPayload(
        tokenPayload.userId,
      );

      return authorizedUser;
    } catch (error) {
      throw error;
    }
  }
}
