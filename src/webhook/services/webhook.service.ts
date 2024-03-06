import { Inject, Injectable, Type } from '@nestjs/common';
import {
  Field,
  NotificationOption,
  ServerExceptionField,
  WarningExceptionFiled,
} from '@src/webhook/type/webhook.type';
import { bold, EmbedBuilder, WebhookClient } from 'discord.js';
import {
  EMBED_BUILDER_TOKEN,
  WEBHOOK_CLIENT_TOKEN,
} from '../constants/webhook.constant';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookService {
  constructor(
    @Inject(EMBED_BUILDER_TOKEN)
    private readonly embedBuilder: Type<EmbedBuilder>,
    @Inject(WEBHOOK_CLIENT_TOKEN)
    private readonly webhookClient: Type<WebhookClient>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 400번대 에러 또는 인지해야하는 상황
   */
  async warning(exceptionField: WarningExceptionFiled): Promise<void> {
    const { description, ...serverExceptionField } = exceptionField;

    await this.send(this.configService.get<string>('DISCORD_WEBHOOK_URL'), {
      description,
      color: '#FFA500', // 주황
      title: 'server warning exception',
      fields: this.buildServerExceptionField(serverExceptionField),
    });
  }

  /**
   * 500번대 에러 시
   */
  async error(exceptionField: ServerExceptionField): Promise<void> {
    await this.send(this.configService.get<string>('DISCORD_WEBHOOK_URL'), {
      color: '#a63641', // 빨강
      title: 'server error exception',
      fields: this.buildServerExceptionField(exceptionField),
    });
  }

  /**
   * 실제 webhook 을 통해 보내는 메서드
   */
  async send(url, option: NotificationOption): Promise<void> {
    const { title, color, description, fields } = option;

    const webhookClient = new this.webhookClient({
      url,
    });

    const embed = new this.embedBuilder()
      .setTitle(title)
      .setColor(color)
      .setTimestamp();

    if (fields && fields.length) {
      embed.setFields(...fields);
    }

    if (description) {
      embed.setDescription(description);
    }

    await webhookClient
      .send({
        username: 'connection',
        content: bold('connection server webhook notification'),
        avatarURL: 'https://avatars.githubusercontent.com/u/142480276',
        embeds: [embed],
      })
      .catch((e) => {
        console.error(e);
      });
  }

  private buildServerExceptionField(
    exceptionField: Partial<ServerExceptionField>,
  ): Field[] {
    const { name, method, path, status, body, stack } = exceptionField;
    const fields: Field[] = [];

    if (name) {
      fields.push({
        name: 'Exception name',
        value: name,
        inline: false,
      });
    }

    if (method) {
      fields.push({
        name: 'Method',
        value: method,
        inline: false,
      });
    }

    if (path) {
      fields.push({
        name: 'Path',
        value: path.slice(0, 1000),
        inline: true,
      });
    }

    if (status) {
      fields.push({
        name: 'Status',
        value: status.toString(),
        inline: true,
      });
    }

    if (body) {
      fields.push({
        name: 'Body',
        value: JSON.stringify(body).slice(0, 1000),
        inline: false,
      });
    }

    if (stack) {
      fields.push({
        name: 'Error Stack',
        value: JSON.stringify(stack).slice(0, 1000),
        inline: false,
      });
    }

    return fields;
  }
}
