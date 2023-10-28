import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Lecturer } from '@prisma/client';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import {
  GetLecturerResult,
  LecturerTokenPayload,
  ValidateResult,
} from '@src/common/interface/common-interface';
import { AuthTokenService } from '@src/auth/services/auth-token.service';

@Injectable()
export class LecturerAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'lecturerAccessToken',
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

  async validate(tokenPayload: LecturerTokenPayload): Promise<ValidateResult> {
    try {
      if (!tokenPayload.lecturerId) {
        throw new UnauthorizedException(
          '잘못된 토큰 형식입니다.',
          'InvalidTokenFormat',
        );
      }
      const authorizedLecturer: GetLecturerResult =
        await this.authTokenService.getLecturerByPayload(
          tokenPayload.lecturerId,
        );

      if (!authorizedLecturer) {
        throw new BadRequestException(
          `유효하지 않은 강사 정보 요청입니다.`,
          'InvalidLecturerInformation',
        );
      }

      return { lecturer: authorizedLecturer };
    } catch (error) {
      throw error;
    }
  }
}
