import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import {
  GetLecturerResult,
  GetUserResult,
  TokenPayload,
  ValidateResult,
} from 'src/common/interface/common-interface';
import { Lecturer, Users } from '@prisma/client';
import { AuthTokenService } from '@src/auth/services/auth-token.service';
import { CookiesTokenExtractor } from '@src/auth/extractor/cookie-token-extractor';
import { TokenTypes } from '@src/auth/enums/token-enums';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authTokenService: AuthTokenService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_TOKEN_SECRET_KEY'),
      jwtFromRequest: CookiesTokenExtractor.refreshTokenFromCookies(),
      passReqToCallback: true,
    });
  }

  async validate(request, tokenPayload: TokenPayload): Promise<ValidateResult> {
    try {
      if (!tokenPayload.userId && !tokenPayload.lecturerId) {
        throw new UnauthorizedException(
          '잘못된 토큰 형식입니다.',
          'InvalidTokenFormat',
        );
      }

      const refreshTokenCookie = request.cookies.refreshToken;

      if (tokenPayload.userId) {
        return this.validateUserRefreshToken(tokenPayload, refreshTokenCookie);
      }

      if (tokenPayload.lecturerId) {
        return this.validateLecturerRefreshToken(
          tokenPayload,
          refreshTokenCookie,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  private async validateUserRefreshToken(
    tokenPayload: TokenPayload,
    refreshToken: string,
  ): Promise<ValidateResult> {
    const authorizedUser: GetUserResult =
      await this.authTokenService.getUserByPayload(tokenPayload.userId);
    if (!authorizedUser) {
      throw new BadRequestException(
        '유효하지 않는 유저 정보 요청입니다.',
        'InvalidUserInformation',
      );
    }

    await this.authTokenService.validateRefreshToken(
      refreshToken,
      authorizedUser.id,
      TokenTypes.User,
    );

    return { user: authorizedUser, tokenType: TokenTypes.User };
  }

  private async validateLecturerRefreshToken(
    tokenPayload: TokenPayload,
    refreshToken: string,
  ): Promise<ValidateResult> {
    const authorizedLecturer: GetLecturerResult =
      await this.authTokenService.getLecturerByPayload(tokenPayload.lecturerId);
    if (!authorizedLecturer) {
      throw new BadRequestException(
        '유효하지 않는 강사 정보 요청입니다.',
        'InvalidLecturerInformation',
      );
    }

    await this.authTokenService.validateRefreshToken(
      refreshToken,
      authorizedLecturer.id,
      TokenTypes.Lecturer,
    );

    return { lecturer: authorizedLecturer, tokenType: TokenTypes.Lecturer };
  }
}
