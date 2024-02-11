import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import {
  EMBED_BUILDER_TOKEN,
  WEBHOOK_CLIENT_TOKEN,
} from './constants/webhook.constant';
import { ConfigService } from '@nestjs/config';
import { WebhookService } from './services/webhook.service';

@Module({
  providers: [
    WebhookService,
    {
      provide: EMBED_BUILDER_TOKEN,
      useValue: EmbedBuilder,
    },
    {
      provide: WEBHOOK_CLIENT_TOKEN,
      useValue: WebhookClient,
    },
  ],
  exports: [WebhookService],
})
export class WebhookModule implements OnApplicationBootstrap {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const webhookService = this.moduleRef.get<WebhookService>(WebhookService);

    // await webhookService
    //   .send(this.configService.get<string>('DISCORD_WEBHOOK_URL'), {
    //     color: '#33FF68', // 연두
    //     title: 'Build Success',
    //     description: 'Current Environment Variable List',
    //   })
    //   .catch((e) => {
    //     console.error(e);
    //   });
  }
}
