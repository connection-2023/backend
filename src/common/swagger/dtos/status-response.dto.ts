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

  static swaggerBuilder(status: Exclude<HttpStatus, ErrorHttpStatusCode>) {
    class Temp extends this {
      @ApiProperty({
        name: 'status',
        example: `${status}`,
        enum: HttpStatus,
      })
      private readonly status: string;
    }

    Object.defineProperty(Temp, 'name', {
      value: `StatusDto`,
    });

    return applyDecorators(ApiResponse({ status, type: Temp }));
  }

  constructor(res: { [key: string]: unknown }) {
    Object.assign(this, res);
  }
}
