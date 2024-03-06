import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SET_RESPONSE_KEY } from '@src/common/symboles/response-symbol';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const key = this.reflector.get<string | undefined>(
      SET_RESPONSE_KEY,
      context.getHandler(),
    );

    const statusCode = context.getArgByIndex(1).statusCode;

    return next.handle().pipe(
      map((data) => {
        if (data && data.statusCode) {
          const { statusCode, ...etc } = data;

          return { statusCode, data: etc };
        }

        if (key) {
          return { statusCode, data: { [key]: data } };
        }

        return { statusCode, data };
      }),
    );
  }
}
