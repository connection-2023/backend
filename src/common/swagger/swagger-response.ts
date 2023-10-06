export const SwaggerApiResponse: any = {
  success: (description: string, response?: any) => {
    const example = {
      response,
    };

    return {
      description,
      schema: {
        example,
      },
    };
  },
};
