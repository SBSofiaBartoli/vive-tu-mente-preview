import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AdminRolesGuard } from '../auth/admin-roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpsertSiteContentDto } from './dto/upsert-site-content.dto';
import { ContentService } from './content.service';
import { SiteContentResponseDto } from './dto/site-content-response.dto';

@ApiTags('Site Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar contenido editable para administración',
    description:
      'Devuelve todas las secciones editables del sitio, incluyendo activas e inactivas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado administrativo de contenido editable.',
    type: SiteContentResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiResponse({
    status: 403,
    description: 'El usuario no tiene permisos para administrar contenido.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'editor')
  @Get('admin')
  findAllAdmin() {
    return this.contentService.findAllAdmin();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear o actualizar contenido editable',
    description:
      'Crea o actualiza una sección editable del sitio usando section_key como clave única.',
  })
  @ApiResponse({
    status: 201,
    description: 'Contenido editable guardado correctamente.',
    type: SiteContentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Los datos enviados no cumplen con las validaciones requeridas.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiResponse({
    status: 403,
    description: 'El usuario no tiene permisos para administrar contenido.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'editor')
  @Post('admin')
  upsert(@Body() upsertSiteContentDto: UpsertSiteContentDto) {
    return this.contentService.upsert(upsertSiteContentDto);
  }

  @ApiOperation({
    summary: 'Obtener contenido editable por clave',
    description:
      'Devuelve una sección editable del sitio a partir de su clave identificadora.',
  })
  @ApiParam({
    name: 'sectionKey',
    example: 'home-hero',
    description: 'Clave única de la sección editable.',
  })
  @ApiResponse({
    status: 200,
    description: 'Contenido editable encontrado.',
    type: SiteContentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No existe contenido para la clave indicada.',
  })
  @Get(':sectionKey')
  getBySectionKey(@Param('sectionKey') sectionKey: string) {
    return this.contentService.getBySectionKey(sectionKey);
  }
}
