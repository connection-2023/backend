import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptions,
  ApiResponse,
} from '@nestjs/swagger';

export class StatusResponseDto {
  [key: string]: unknown;

  static swaggerBuilder(
    status: Exclude<HttpStatus, ErrorHttpStatusCode>,
    key: string,
  ) {
    class Temp extends this {
      @ApiProperty({
        name: 'statusCode',
        example: `${status}`,
        enum: HttpStatus,
      })
      private readonly statusCode: string;
    }

    Object.defineProperty(Temp, 'name', {
      value: `${key[0].toUpperCase()}${key.slice(1)}StatusDto`,
    });

    return applyDecorators(ApiResponse({ status, type: Temp }));
  }

  constructor(res: { [key: string]: unknown }) {
    Object.assign(this, res);
  }
}
