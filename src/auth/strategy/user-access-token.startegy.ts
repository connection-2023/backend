import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Users } from '@prisma/client';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import {
  GetUserResult,
  UserTokenPayload,
  ValidateResult,
} from '@src/common/interface/common-interface';
import { AuthTokenService } from '@src/auth/services/auth-token.service';

@Injectable()
export class UserAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'userAccessToken',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authTokenService: AuthTokenService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_TOKEN_SECRET_KEY'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(tokenPayload: UserTokenPayload): Promise<ValidateResult> {
    try {
      if (!tokenPayload.userId) {
        throw new UnauthorizedException(
          '잘못된 토큰 형식입니다.',
          'InvalidTokenFormat',
        );
      }
      const authorizedUser: GetUserResult =
        await this.authTokenService.getUserByPayload(tokenPayload.userId);
      if (!authorizedUser) {
        throw new BadRequestException(
          `유효하지 않은 유저 정보 요청입니다.`,
          'InvalidUserInformation',
        );
      }

      return { user: authorizedUser };
    } catch (error) {
      throw error;
    }
  }
}
