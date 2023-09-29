import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAuthorizedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    console.log(ctx.switchToHttp().getRequest());

    const { user } = ctx.switchToHttp().getRequest();

    return user;
  },
);
