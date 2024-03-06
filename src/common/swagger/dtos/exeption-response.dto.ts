import { applyDecorators } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ApiResponse } from '@nestjs/swagger';

export class ExceptionResponseDto {
  [key: string]: unknown;

  static swaggerBuilder(
    status: ErrorHttpStatusCode,
    errors: { error: string; description: string }[],
  ) {
    const examples = {};

    errors.forEach(({ error, description }) => {
      examples[error] = { value: { statusCode: status, error, description } };
    });

    return applyDecorators(
      ApiResponse({
        status,
        content: {
          'application-json': {
            examples,
          },
        },
      }),
    );
  }
}
