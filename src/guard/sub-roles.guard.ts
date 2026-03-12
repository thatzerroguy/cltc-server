import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { sub_Role, SUB_ROLES_KEY } from 'src/decorators/sub-roles.decorator';

@Injectable()
export class SubRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredSubRoles = this.reflector.getAllAndOverride<sub_Role[]>(
      SUB_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredSubRoles) {
      return true;
    }
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { sub_role: sub_Role } }>();
    const user = request.user;

    if (!user) {
      return false;
    }

    return requiredSubRoles.includes(user.sub_role);
  }
}
