import { Module } from '@nestjs/common';
import { AuthController } from '@src/auth/controllers/auth.controller';
import { AuthService } from '@src/auth/services/auth.service';
import { UserAccessTokenStrategy } from '@src/auth/strategy/user-access-token.startegy';
import { CustomJwtModule } from '@src/common/config/jwt-module.cofig';
import { LecturerAccessTokenStrategy } from '@src/auth/strategy/lecturer-access-token.startegy';
import { UserRefreshTokenStrategy } from '@src/auth/strategy/user-refresh-token.strategy';
import { LecturerRefreshTokenStrategy } from '@src/auth/strategy/lecturer-refresh-token.strategy';

@Module({
  imports: [CustomJwtModule],
  providers: [
    AuthService,
    UserAccessTokenStrategy,
    UserRefreshTokenStrategy,
    LecturerAccessTokenStrategy,
    LecturerRefreshTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
