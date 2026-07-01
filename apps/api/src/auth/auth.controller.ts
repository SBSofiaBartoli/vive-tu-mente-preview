import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AdminAuthGuard, type AdminAuthRequest } from './admin-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener usuario administrador autenticado',
    description:
      'Valida el token enviado por Bearer Auth y devuelve el usuario de Supabase junto con su perfil administrativo activo.',
  })
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
