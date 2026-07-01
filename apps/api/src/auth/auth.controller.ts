import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AdminAuthGuard, type AdminAuthRequest } from './admin-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener usuario administrador autenticado',
    description:
      'Valida el token enviado por Bearer Auth y devuelve el usuario de Supabase junto con su perfil administrativo activo.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario administrador autenticado correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiResponse({
    status: 403,
    description: 'El usuario no tiene acceso administrativo activo.',
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
