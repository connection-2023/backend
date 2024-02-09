import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ApiExtraModels, ApiProperty, ApiResponse } from '@nestjs/swagger';

export class PaginationResponseDto {
  [key: string]: unknown;

  static swaggerBuilder(
    status: Exclude<HttpStatus, ErrorHttpStatusCode>,
    key: string,
    type: Type,
  ) {
    class Data {
      @ApiProperty({
        type: Number,
      })
      private readonly totalItemCount: number;

      @ApiProperty({
        type,
        name: key,
        isArray: true,
      })
      private readonly temp: string;
    }

    class Temp extends this {
      @ApiProperty({
        name: 'status',
        example: `${status}`,
        enum: HttpStatus,
      })
      private readonly status: string;

      @ApiProperty({
        name: 'data',
      })
      private readonly data: Data = new Data();
    }

    Object.defineProperty(Temp, 'name', {
      value: `${key[0].toUpperCase()}${key.slice(1)}ResponseDto`,
    });

    Object.defineProperty(Data, 'name', {
      value: `${key[0].toUpperCase()}${key.slice(1)}DataDto`,
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
