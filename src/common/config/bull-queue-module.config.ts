import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

export const BullQueueModuleConfig = BullModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    redis: {
      host: configService.get<string>('REDIS_URL'),
      port: configService.get<number>('REDIS_PORT'),
    },
  }),
  inject: [ConfigService],
});
