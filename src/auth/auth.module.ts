import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserAccessTokenStrategy } from './strategy/user-access-token.startegy';
import { CustomJwtModule } from 'src/common/config/jwt-module.cofig';
import { LecturerAccessTokenStrategy } from './strategy/lecturer-access-token.startegy';
import { UserRefreshTokenStrategy } from './strategy/user-refresh-token.strategy';
import { LecturerRefreshTokenStrategy } from './strategy/lecturer-refresh-token.strategy';

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
