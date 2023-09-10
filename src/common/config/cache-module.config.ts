import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

export const CustomCacheModule = CacheModule.register({
  isGlobal: true,
  useFactory: (configService: ConfigService) => ({
    store: localStorage,
    host: configService.get<string>('REDIS_URL'),
    port: configService.get<string>('REDIS_PORT'),
  }),
});
