import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AccessTokenStrategy } from './strategy/access-token.startegy';
import { CustomJwtModule } from 'src/common/config/jwt-module.cofig';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';

@Module({
  imports: [CustomJwtModule],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
