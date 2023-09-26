import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AccessTokenStrategy } from './strategy/access-token.startegy';
import { CustomJwtModule } from 'src/common/config/jwt-module.cofig';

@Module({
  imports: [CustomJwtModule],
  providers: [AuthService, AccessTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
