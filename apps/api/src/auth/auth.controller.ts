import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AdminAuthGuard, type AdminAuthRequest } from './admin-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(AdminAuthGuard)
  @Get('me')
  getMe(@Req() request: AdminAuthRequest) {
    return {
      user: {
        id: request.supabaseUser?.id,
        email: request.supabaseUser?.email,
      },
      profile: request.adminProfile,
    };
  }
}
