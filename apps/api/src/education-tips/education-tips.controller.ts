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
import { CreateEducationTipDto } from './dto/create-education-tip.dto';
import { EducationTipResponseDto } from './dto/education-tip-response.dto';
import { UpdateEducationTipDto } from './dto/update-education-tip.dto';
import { EducationTipsService } from './education-tips.service';
import { ListEducationTipsAdminQueryDto } from './dto/list-education-tips-admin-query.dto';
import { PaginatedEducationTipsResponseDto } from './dto/paginated-education-tips-response.dto';

@ApiTags('Education Tips')
@Controller('education-tips')
export class EducationTipsController {
  constructor(private readonly educationTipsService: EducationTipsService) {}

  @ApiOperation({
    summary: 'Listar tips educativos públicos',
    description:
      'Devuelve tips activos y vigentes. Puede filtrarse por segmento educativo.',
  })
  @ApiQuery({
    name: 'segmentKey',
    required: false,
    example: 'ia-aplicada',
    description: 'Clave opcional del segmento educativo.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de tips educativos públicos.',
    type: EducationTipResponseDto,
    isArray: true,
  })
  @Get()
  findPublic(@Query('segmentKey') segmentKey?: string) {
    return this.educationTipsService.findPublic(segmentKey);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar tips educativos para administración',
    description:
      'Devuelve todos los tips educativos, incluyendo activos, inactivos y programados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado administrativo de tips educativos.',
    type: PaginatedEducationTipsResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiResponse({
    status: 403,
    description:
      'El usuario no tiene permisos para administrar tips educativos.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'editor')
  @Get('admin')
  findAllAdmin(@Query() query: ListEducationTipsAdminQueryDto) {
    return this.educationTipsService.findAllAdmin(query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear tip educativo',
    description:
      'Crea un nuevo tip educativo asociado a una card o segmento de educación.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tip educativo creado correctamente.',
    type: EducationTipResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Los datos enviados no cumplen con las validaciones requeridas.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'editor')
  @Post('admin')
  create(@Body() createEducationTipDto: CreateEducationTipDto) {
    return this.educationTipsService.create(createEducationTipDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar tip educativo',
    description:
      'Actualiza el contenido, segmento, vigencia o visibilidad de un tip educativo.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único del tip educativo.',
    example: '9f4b8d7a-1234-4567-8901-abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Tip educativo actualizado correctamente.',
    type: EducationTipResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el tip educativo indicado.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'editor')
  @Patch('admin/:id')
  update(
    @Param('id') id: string,
    @Body() updateEducationTipDto: UpdateEducationTipDto,
  ) {
    return this.educationTipsService.update(id, updateEducationTipDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Eliminar tip educativo',
    description:
      'Elimina un tip educativo del sistema. Para ocultarlo sin eliminarlo, usar is_active=false.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único del tip educativo.',
    example: '9f4b8d7a-1234-4567-8901-abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Tip educativo eliminado correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el tip educativo indicado.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin')
  @Delete('admin/:id')
  remove(@Param('id') id: string) {
    return this.educationTipsService.remove(id);
  }
}
