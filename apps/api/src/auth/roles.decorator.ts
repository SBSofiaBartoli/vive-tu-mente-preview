import { SetMetadata } from '@nestjs/common';
import type { AdminRole } from './admin-auth.types';

export const ADMIN_ROLES_KEY = 'admin_roles';

export const Roles = (...roles: AdminRole[]) =>
  SetMetadata(ADMIN_ROLES_KEY, roles);
