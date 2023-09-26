import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

export const CustomCacheModule = CacheModule.register({
  isGlobal: true,
  useFactory: (configService: ConfigService) => ({
    store: redisStore,
    host: configService.get<string>('REDIS_URL'),
    port: configService.get<string>('REDIS_PORT'),
  }),
});
