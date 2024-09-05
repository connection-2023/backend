import { ApiPropertyOptions } from '@nestjs/swagger';
import { ApiErrorResponse } from '../interface/common-interface';

export const SwaggerApiResponse: any = {
  success: (description: string, response?: any) => {
    const example = response;

    return {
      description,
      schema: {
        example,
      },
    };
  },

  exception: (
    responses: ApiErrorResponse[],
    options: Omit<ApiPropertyOptions, 'name' | 'type'> = {},
  ) => {
    const { isArray } = options;
    const examples = {};

    responses.forEach(({ name, example }) => {
      examples[name] = isArray
        ? { value: { errors: [example] } }
        : { value: example };
    });

    return {
      content: { 'application-json': { examples } },
    };
  },
};
