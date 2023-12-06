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

  successWithType: (description: string, type: Type, response?: any) => {
    const example = response;
    const a = new type(type);
    console.log(a);

    return {
      description,
      type,
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
