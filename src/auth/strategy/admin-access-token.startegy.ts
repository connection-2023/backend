import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import {
  AdminTokenPayload,
  GetAdminResult,
  GetUserResult,
  UserTokenPayload,
  ValidateResult,
} from '@src/common/interface/common-interface';
import { AuthTokenService } from '@src/auth/services/auth-token.service';

@Injectable()
export class AdminAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'adminAccessToken',
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

  async validate(tokenPayload: AdminTokenPayload): Promise<ValidateResult> {
    try {
      if (!tokenPayload.adminId) {
        throw new UnauthorizedException(
          '잘못된 토큰 형식입니다.',
          'InvalidTokenFormat',
        );
      }
      const authorizedAdmin: GetAdminResult =
        await this.authTokenService.getAdminByPayload(tokenPayload.adminId);
      if (!authorizedAdmin) {
        throw new BadRequestException(
          `유효하지 않은 관리자 정보 요청입니다.`,
          'InvalidAdminInformation',
        );
      }

      return { admin: authorizedAdmin };
    } catch (error) {
      throw error;
    }
  }
}
