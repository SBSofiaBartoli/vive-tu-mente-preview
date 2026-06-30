import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthService } from './auth.service';
import { AdminAuthGuard } from './admin-auth.guard';
import { AuthController } from './auth.controller';
import { AdminRolesGuard } from './admin-roles.guard';

@Module({
  imports: [SupabaseModule],
  controllers: [AuthController],
  providers: [AuthService, AdminAuthGuard, AdminRolesGuard],
  exports: [AuthService, AdminAuthGuard, AdminRolesGuard],
})
export class AuthModule {}
