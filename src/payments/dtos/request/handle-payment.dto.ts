import { WebhookEventTypes } from '@src/payments/constants/enum';
import { IPaymentWebhookData } from '@src/payments/interface/payments.interface';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class HandlePaymentDto {
  @IsEnum(WebhookEventTypes)
  @IsNotEmpty()
  eventType: WebhookEventTypes;
  @IsNotEmpty()
  createdAt: Date;
  @IsNotEmpty()
  data: IPaymentWebhookData;
}
