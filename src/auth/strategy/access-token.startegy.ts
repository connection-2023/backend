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
  GetLecturerResult,
  GetUserResult,
  TokenPayload,
  UserTokenPayload,
  ValidateResult,
} from '@src/common/interface/common-interface';
import { AuthTokenService } from '@src/auth/services/auth-token.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'accessToken',
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

  async validate({
    userId,
    lecturerId,
  }: TokenPayload): Promise<ValidateResult> {
    try {
      if (userId) {
        const authorizedUser: GetUserResult =
          await this.authTokenService.getUserByPayload(userId);
        if (!authorizedUser) {
          throw new BadRequestException(
            `유효하지 않은 유저 정보 요청입니다.`,
            'InvalidUserInformation',
          );
        }
        return { user: authorizedUser };
      }

      if (lecturerId) {
        const authorizedLecturer: GetLecturerResult =
          await this.authTokenService.getLecturerByPayload(lecturerId);

        if (!authorizedLecturer) {
          throw new BadRequestException(
            `유효하지 않은 강사 정보 요청입니다.`,
            'InvalidLecturerInformation',
          );
        }

        return { lecturer: authorizedLecturer };
      }
    } catch (error) {
      throw error;
    }
  }
}
