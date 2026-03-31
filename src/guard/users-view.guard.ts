import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class UsersViewGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { role: string; sub_role: string } }>();

    const user = request.user;
    if (!user) {
      return false;
    }

    const role = user.role?.toUpperCase();
    const subRole = user.sub_role?.toUpperCase();

    if (role === 'SUPER_ADMIN') {
      return true;
    }

    if (role === 'ADMIN' && subRole === 'DG') {
      return true;
    }

    return false;
  }
}

