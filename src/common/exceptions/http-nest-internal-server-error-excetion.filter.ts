import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { WebhookService } from '@src/webhook/services/webhook.service';
import { Response } from 'express';

/**
 * nestJS 메서드를 이용한 500번 에러 를 잡는 exception filter
 * ex) throw new InternalServerErrorException()
 */
@Catch(InternalServerErrorException)
export class HttpNestInternalServerErrorExceptionFilter
  implements ExceptionFilter<InternalServerErrorException>
{
  constructor(private readonly webhookService: WebhookService) {}

  async catch(
    exception: InternalServerErrorException,
    host: ArgumentsHost,
  ): Promise<void> {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    try {
      await this.webhookService.error({
        name: 'Http Nest Internal Server Error Exception',
        method: request.method,
        path: request.url,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: request.body,
        stack: exception.stack,
      });
    } catch (e) {
      console.error(e);
    }

    response.status(status).json({
      statusCode: status,
      message: 'Internal Server Error',
    });
  }
}
