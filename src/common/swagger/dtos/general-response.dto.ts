import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ApiExtraModels, ApiProperty, ApiResponse } from '@nestjs/swagger';

export class GeneralResponseDto {
  [key: string]: unknown;

  static swaggerBuilder(
    status: Exclude<HttpStatus, ErrorHttpStatusCode>,
    key: string,
    type: Type,
  ) {
    class Temp extends this {
      @ApiProperty({
        name: 'status',
        example: `${status}`,
        enum: HttpStatus,
      })
      private readonly status: string;

      @ApiProperty({
        name: 'data',
        type,
      })
      private readonly data: string;
    }

    Object.defineProperty(Temp, 'name', {
      value: `${key[0].toUpperCase()}${key.slice(1)}Dto`,
    });

    return applyDecorators(
      ApiExtraModels(type),
      ApiResponse({ status, type: Temp }),
    );
  }

  constructor(res: { [key: string]: unknown }) {
    Object.assign(this, res);
  }
}
