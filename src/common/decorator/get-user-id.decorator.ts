import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();

    if (user?.lecturer) {
      return { user: { id: user.lecturer.userId } };
    }

    return user;
  },
);
