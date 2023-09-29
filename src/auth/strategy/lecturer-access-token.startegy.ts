import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Lecturer } from '@prisma/client';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { LecturerTokenPayload } from 'src/common/interface/common-interface';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LecturerAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'lecturerAccessToken',
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

  async validate(tokenPayload: LecturerTokenPayload): Promise<Lecturer> {
    try {
      if (!tokenPayload.lecturerId) {
        throw new UnauthorizedException('잘못된 토큰 형식입니다.');
      }
      const authorizedLecturer: Lecturer =
        await this.authService.getLecturerByPayload(tokenPayload.lecturerId);

      return authorizedLecturer;
    } catch (error) {
      throw error;
    }
  }
}
