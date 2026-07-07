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
import { CreateFaqDto } from './dto/create-faq.dto';
import { FaqResponseDto } from './dto/faq-response.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqsService } from './faqs.service';

@ApiTags('FAQs')
@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @ApiOperation({
    summary: 'Listar preguntas frecuentes públicas',
    description:
      'Devuelve las preguntas frecuentes activas. Puede filtrarse por categoría.',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    example: 'programas',
    description: 'Categoría opcional para filtrar preguntas frecuentes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de preguntas frecuentes públicas.',
    type: FaqResponseDto,
    isArray: true,
  })
  @Get()
  findPublic(@Query('category') category?: string) {
    return this.faqsService.findPublic(category);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar preguntas frecuentes para administración',
    description:
      'Devuelve todas las preguntas frecuentes, incluyendo activas e inactivas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado administrativo de preguntas frecuentes.',
    type: FaqResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiResponse({
    status: 403,
    description:
      'El usuario no tiene permisos para administrar preguntas frecuentes.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'editor')
  @Get('admin')
  findAllAdmin() {
    return this.faqsService.findAllAdmin();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear pregunta frecuente',
    description:
      'Crea una nueva pregunta frecuente editable desde el dashboard administrativo.',
  })
  @ApiResponse({
    status: 201,
    description: 'Pregunta frecuente creada correctamente.',
    type: FaqResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Los datos enviados no cumplen con las validaciones requeridas.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'editor')
  @Post('admin')
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqsService.create(createFaqDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar pregunta frecuente',
    description:
      'Actualiza el contenido, categoría, orden o visibilidad de una pregunta frecuente.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único de la pregunta frecuente.',
    example: '9f4b8d7a-1234-4567-8901-abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Pregunta frecuente actualizada correctamente.',
    type: FaqResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró la pregunta frecuente indicada.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'editor')
  @Patch('admin/:id')
  update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqsService.update(id, updateFaqDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Eliminar pregunta frecuente',
    description:
      'Elimina una pregunta frecuente del sistema. Para ocultarla sin eliminarla, usar is_active=false.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único de la pregunta frecuente.',
    example: '9f4b8d7a-1234-4567-8901-abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Pregunta frecuente eliminada correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró la pregunta frecuente indicada.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin')
  @Delete('admin/:id')
  remove(@Param('id') id: string) {
    return this.faqsService.remove(id);
  }
}
