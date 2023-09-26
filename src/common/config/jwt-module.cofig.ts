import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

export const CustomJwtModule = JwtModule.registerAsync({
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_TOKEN_SECRET_KEY'),
  }),
  inject: [ConfigService],
});
