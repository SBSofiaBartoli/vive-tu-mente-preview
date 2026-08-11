import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
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
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { RejectTestimonialDto } from './dto/reject-testimonial.dto';
import { TestimonialResponseDto } from './dto/testimonial-response.dto';
import { UpdateTestimonialFeaturedDto } from './dto/update-testimonial-featured.dto';
import { TestimonialsService } from './testimonials.service';
import { ListTestimonialsAdminQueryDto } from './dto/list-testimonials-admin-query.dto';
import { PaginatedTestimonialsResponseDto } from './dto/paginated-testimonials-response.dto';

@ApiTags('Testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @ApiOperation({
    summary: 'Listar testimonios aprobados',
    description:
      'Devuelve los testimonios aprobados que pueden mostrarse públicamente en el sitio.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de testimonios aprobados.',
    type: TestimonialResponseDto,
    isArray: true,
  })
  @Get()
  findApproved() {
    return this.testimonialsService.findApproved();
  }

  @ApiOperation({
    summary: 'Listar testimonios destacados',
    description:
      'Devuelve testimonios aprobados marcados como destacados para secciones principales del sitio.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de testimonios destacados.',
    type: TestimonialResponseDto,
    isArray: true,
  })
  @Get('featured')
  findFeatured() {
    return this.testimonialsService.findFeatured();
  }

  @ApiOperation({
    summary: 'Enviar nuevo testimonio',
    description:
      'Permite que una persona envíe un testimonio. El testimonio queda pendiente hasta revisión administrativa.',
  })
  @ApiResponse({
    status: 201,
    description: 'Testimonio recibido correctamente y pendiente de revisión.',
    type: TestimonialResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Los datos enviados no cumplen con las validaciones requeridas.',
  })
  @Post()
  create(@Body() createTestimonialDto: CreateTestimonialDto) {
    return this.testimonialsService.create(createTestimonialDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar testimonios para administración',
    description:
      'Permite listar testimonios con paginación, búsqueda y filtros por estado, rol o destacado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado administrativo paginado de testimonios.',
    type: PaginatedTestimonialsResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiResponse({
    status: 403,
    description: 'El usuario no tiene permisos para revisar testimonios.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'reviewer')
  @Get('admin')
  findAllAdmin(@Query() query: ListTestimonialsAdminQueryDto) {
    return this.testimonialsService.findAllAdmin(query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar testimonios pendientes',
    description:
      'Devuelve testimonios enviados por usuarios que todavía requieren revisión administrativa.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de testimonios pendientes.',
    type: TestimonialResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiResponse({
    status: 403,
    description: 'El usuario no tiene permisos para revisar testimonios.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'reviewer')
  @Get('admin/pending')
  findPending() {
    return this.testimonialsService.findPending();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Aprobar testimonio',
    description:
      'Marca un testimonio como aprobado para que pueda visualizarse públicamente.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único del testimonio.',
    example: '9f4b8d7a-1234-4567-8901-abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Testimonio aprobado correctamente.',
    type: TestimonialResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el testimonio indicado.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'reviewer')
  @Patch('admin/:id/approve')
  approve(@Param('id') id: string) {
    return this.testimonialsService.approve(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Rechazar testimonio',
    description:
      'Marca un testimonio como rechazado y registra el motivo interno de rechazo.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único del testimonio.',
    example: '9f4b8d7a-1234-4567-8901-abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Testimonio rechazado correctamente.',
    type: TestimonialResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el testimonio indicado.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'reviewer')
  @Patch('admin/:id/reject')
  reject(
    @Param('id') id: string,
    @Body() rejectTestimonialDto: RejectTestimonialDto,
  ) {
    return this.testimonialsService.reject(id, rejectTestimonialDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar destacado de testimonio',
    description:
      'Permite marcar o desmarcar un testimonio como destacado dentro del sitio.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único del testimonio.',
    example: '9f4b8d7a-1234-4567-8901-abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado destacado actualizado correctamente.',
    type: TestimonialResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el testimonio indicado.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'reviewer')
  @Patch('admin/:id/featured')
  updateFeatured(
    @Param('id') id: string,
    @Body() updateTestimonialFeaturedDto: UpdateTestimonialFeaturedDto,
  ) {
    return this.testimonialsService.updateFeatured(
      id,
      updateTestimonialFeaturedDto,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Eliminar testimonio',
    description:
      'Elimina un testimonio del sistema. Esta acción debería usarse solo cuando corresponda una baja definitiva.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único del testimonio.',
    example: '9f4b8d7a-1234-4567-8901-abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Testimonio eliminado correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el testimonio indicado.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin')
  @Delete('admin/:id')
  remove(@Param('id') id: string) {
    return this.testimonialsService.remove(id);
  }
}
