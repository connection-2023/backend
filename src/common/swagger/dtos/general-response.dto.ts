import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ApiExtraModels, ApiProperty, ApiResponse } from '@nestjs/swagger';

//여러 데이터가 합쳐졌을 때 사용
export class GeneralResponseDto {
  [key: string]: unknown;

  static swaggerBuilder(
    status: Exclude<HttpStatus, ErrorHttpStatusCode>,
    key: string,
    type: Type,
  ) {
    class Temp extends this {
      @ApiProperty({
        name: 'statusCode',
        example: `${status}`,
        enum: HttpStatus,
      })
      private readonly statusCode: string;

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
