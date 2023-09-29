import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserAccessTokenStrategy } from './strategy/user-access-token.startegy';
import { CustomJwtModule } from 'src/common/config/jwt-module.cofig';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
import { LecturerAccessTokenStrategy } from './strategy/lecturer-access-token.startegy';

@Module({
  imports: [CustomJwtModule],
  providers: [
    AuthService,
    UserAccessTokenStrategy,
    LecturerAccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
