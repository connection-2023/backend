import { ApiOperationOptions } from '@nestjs/swagger';

export type ApiOperator<M extends string> = {
  [key in Capitalize<M>]: (
    apiOperationOptions: Required<Pick<ApiOperationOptions, 'summary'>> &
      ApiOperationOptions,
  ) => PropertyDecorator;
};
