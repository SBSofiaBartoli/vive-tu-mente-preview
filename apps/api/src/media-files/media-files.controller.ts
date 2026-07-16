import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AdminRolesGuard } from '../auth/admin-roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateMediaFileDto } from './dto/create-media-file.dto';
import { MediaFileResponseDto } from './dto/media-file-response.dto';
import { UpdateMediaFileStatusDto } from './dto/update-media-file-status.dto';
import { MediaFilesService } from './media-files.service';
import { ListMediaFilesAdminQueryDto } from './dto/list-media-files-admin-query.dto';
import { PaginatedMediaFilesResponseDto } from './dto/paginated-media-files-response.dto';

@ApiTags('Media Files')
@Controller('media-files')
export class MediaFilesController {
  constructor(private readonly mediaFilesService: MediaFilesService) {}

  @ApiOperation({
    summary: 'Listar archivos aprobados',
    description:
      'Devuelve archivos multimedia aprobados. Puede filtrarse por sección.',
  })
  @ApiQuery({
    name: 'section',
    required: false,
    example: 'donation',
    description: 'Sección opcional del sitio asociada al archivo.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de archivos aprobados.',
    type: MediaFileResponseDto,
    isArray: true,
  })
  @Get()
  findApproved(@Query('section') section?: string) {
    return this.mediaFilesService.findApproved(section);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar archivos para administración',
    description:
      'Devuelve archivos cargados en el sistema, incluyendo pendientes, aprobados, rechazados y archivados.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    example: 'pending',
    description: 'Estado opcional para filtrar archivos.',
  })
  @ApiQuery({
    name: 'section',
    required: false,
    example: 'donation',
    description: 'Sección opcional para filtrar archivos.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado administrativo de archivos multimedia.',
    type: PaginatedMediaFilesResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiResponse({
    status: 403,
    description: 'El usuario no tiene permisos para administrar archivos.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'editor', 'reviewer')
  @Get('admin')
  findAllAdmin(@Query() query: ListMediaFilesAdminQueryDto) {
    return this.mediaFilesService.findAllAdmin(query);
  }

  @ApiOperation({
    summary: 'Registrar archivo multimedia',
    description:
      'Registra la metadata de un archivo subido a Supabase Storage. El archivo queda pendiente de revisión.',
  })
  @ApiResponse({
    status: 201,
    description: 'Archivo registrado correctamente y pendiente de revisión.',
    type: MediaFileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Los datos enviados no cumplen con las validaciones requeridas.',
  })
  @Post()
  create(@Body() createMediaFileDto: CreateMediaFileDto) {
    return this.mediaFilesService.create(createMediaFileDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar estado de archivo',
    description:
      'Permite aprobar, rechazar, archivar o solicitar cambios sobre un archivo multimedia.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único del archivo multimedia.',
    example: '9f4b8d7a-1234-4567-8901-abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del archivo actualizado correctamente.',
    type: MediaFileResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el archivo indicado.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'editor', 'reviewer')
  @Patch('admin/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateMediaFileStatusDto: UpdateMediaFileStatusDto,
  ) {
    return this.mediaFilesService.updateStatus(id, updateMediaFileStatusDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Eliminar archivo multimedia',
    description:
      'Elimina la metadata del archivo en la base de datos. La eliminación física en Storage debe gestionarse aparte.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único del archivo multimedia.',
    example: '9f4b8d7a-1234-4567-8901-abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo eliminado correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el archivo indicado.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin')
  @Delete('admin/:id')
  remove(@Param('id') id: string) {
    return this.mediaFilesService.remove(id);
  }
}
