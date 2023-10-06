import { Module } from '@nestjs/common';
import { AuthSmsController } from '@src/auth/controllers/auth-sms.controller';
import { AuthSmsService } from '@src/auth/services/auth-sms.service';
import { UserAccessTokenStrategy } from '@src/auth/strategy/user-access-token.startegy';
import { CustomJwtModule } from '@src/common/config/jwt-module.cofig';
import { LecturerAccessTokenStrategy } from '@src/auth/strategy/lecturer-access-token.startegy';
import { UserRefreshTokenStrategy } from '@src/auth/strategy/user-refresh-token.strategy';
import { LecturerRefreshTokenStrategy } from '@src/auth/strategy/lecturer-refresh-token.strategy';
import { AuthTokenController } from '@src/auth/controllers/auth-token.controller';
import { AuthTokenService } from '@src/auth/services/auth-token.service';
import { AuthOAuthController } from '@src/auth/controllers/auth-oauth.controller';
import { AuthOAuthService } from '@src/auth/services/auth-oauth.service';
import { AuthController } from '@src/auth/controllers/auth.controller';
import { AuthService } from '@src/auth/services/auth.service';
import { AuthRepository } from './repository/auth.repository';

@Module({
  imports: [CustomJwtModule],
  providers: [
    AuthService,
    AuthSmsService,
    AuthTokenService,
    AuthOAuthService,
    UserAccessTokenStrategy,
    UserRefreshTokenStrategy,
    LecturerAccessTokenStrategy,
    LecturerRefreshTokenStrategy,
    AuthRepository,
  ],
  controllers: [
    AuthController,
    AuthSmsController,
    AuthTokenController,
    AuthOAuthController,
  ],
})
export class AuthModule {}
