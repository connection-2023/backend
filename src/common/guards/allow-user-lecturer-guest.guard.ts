import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AllowUserLecturerAndGuestGuard extends AuthGuard('accessToken') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return request.headers['authorization'] ? super.canActivate(context) : true;
  }
}
