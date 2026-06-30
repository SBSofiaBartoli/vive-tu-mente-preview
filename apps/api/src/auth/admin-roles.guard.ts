import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_ROLES_KEY } from './roles.decorator';
import type { AdminRole } from './admin-auth.types';
import type { AdminAuthRequest } from './admin-auth.guard';

@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.getAllAndOverride<AdminRole[]>(
      ADMIN_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!allowedRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AdminAuthRequest>();
    const userRole = request.adminProfile?.role;

    return Boolean(userRole && allowedRoles.includes(userRole));
  }
}
