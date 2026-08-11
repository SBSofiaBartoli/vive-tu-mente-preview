import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import type { AdminProfile } from './admin-auth.types';
import type { User } from '@supabase/supabase-js';

export type AdminAuthRequest = Request & {
  adminProfile?: AdminProfile;
  supabaseUser?: User;
};

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AdminAuthRequest>();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authorizationHeader.replace('Bearer ', '').trim();

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const authenticatedAdmin = await this.authService.validateAdminToken(token);

    request.supabaseUser = authenticatedAdmin.user;
    request.adminProfile = authenticatedAdmin.profile;

    return true;
  }
}
