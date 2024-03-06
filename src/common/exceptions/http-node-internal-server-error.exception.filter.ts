import { WebhookService } from '@src/webhook/services/webhook.service';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * 예상하지 못한 에러 발생 시 nodeJS 레벨에서 발생하는 에러
 * ex) throw new Error()
 */
@Catch()
export class HttpNodeInternalServerErrorExceptionFilter
  implements ExceptionFilter
{
  constructor(private readonly webhookService: WebhookService) {}

  private logger = new Logger(HttpNodeInternalServerErrorExceptionFilter.name);

  async catch(exception: any, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    try {
      await this.webhookService.error({
        name: 'Http Node Internal Server Error Exception',
        method: request.method,
        path: request.url,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: request.body,
        stack: exception.stack,
      });
    } catch (e) {
      console.error(e);
    }

    const log = {
      method: request.method,
      path: request.url,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: request.body,
    };

    this.logger.error(log, exception.stack);

    response.status(status).json({
      statusCode: status,
      message: 'Internal Server Error',
    });
  }
}
