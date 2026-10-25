import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthUser } from '../../interfaces/auth-user/auth-user.interface.js';
import type { RequestWithUser } from '../../interfaces/request-with-user/request-with-user.interface.js';

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<RequestWithUser>().user;
    return data ? user?.[data] : user;
  },
);