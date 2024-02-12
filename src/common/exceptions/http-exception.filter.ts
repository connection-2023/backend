import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { WebhookService } from '@src/webhook/services/webhook.service';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (status === 401 && ctx.getResponse().req.authInfo) {
      const errorMessageObject = ctx.getResponse().req.authInfo;
      const errorMessage = errorMessageObject.message;

      let errorType: string;
      if (errorMessage) {
        if (errorMessage.includes('No auth token')) {
          errorType = 'NoAuthToken';
        } else if (
          errorMessage.includes('invalid signature') ||
          errorMessage.includes('invalid token')
        ) {
          errorType = 'InvalidToken';
        } else if (errorMessage.includes('jwt expired')) {
          errorType = 'JwtExpired';
        } else {
          errorType = 'Unauthorized';
        }

        const log = {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: errorMessage,
          exceptionResponse,
        };

        if (errorType) {
          this.logger.error(log);
          response.status(status).json({
            statusCode: 401,
            message: errorMessage,
            error: errorType,
          });
        }
      }
    } else {
      const log = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
        exceptionResponse,
      };
      this.logger.error(log);

      response.status(status).json(exceptionResponse);
    }
  }
}
