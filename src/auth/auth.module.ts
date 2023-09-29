import { Module } from '@nestjs/common';
import { AuthSmsController } from '@src/auth/controllers/auth-sms.controller';
import { AuthSmsService } from '@src/auth/services/auth-sms.service';
import { UserAccessTokenStrategy } from '@src/auth/strategy/user-access-token.startegy';
import { CustomJwtModule } from '@src/common/config/jwt-module.cofig';
import { LecturerAccessTokenStrategy } from '@src/auth/strategy/lecturer-access-token.startegy';
import { UserRefreshTokenStrategy } from '@src/auth/strategy/user-refresh-token.strategy';
import { LecturerRefreshTokenStrategy } from '@src/auth/strategy/lecturer-refresh-token.strategy';
import { AuthTokenController } from '@src/auth/controllers/auth-token.controller';
import { AuthTokenService } from './services/auth-token.service';

@Module({
  imports: [CustomJwtModule],
  providers: [
    AuthSmsService,
    AuthTokenService,
    UserAccessTokenStrategy,
    UserRefreshTokenStrategy,
    LecturerAccessTokenStrategy,
    LecturerRefreshTokenStrategy,
  ],
  controllers: [AuthSmsController, AuthTokenController],
})
export class AuthModule {}
