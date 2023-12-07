import { Type } from '@nestjs/common';
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

  exception: (responses: ApiErrorResponse[]) => {
    const examples = {};

    responses.forEach(({ name, example }) => {
      examples[name] = { value: example };
    });

    return {
      content: { 'application-json': { examples } },
    };
  },
};
