import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
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
import { CreateEducationCardDto } from './dto/create-education-card.dto';
import { EducationCardResponseDto } from './dto/education-card-response.dto';
import { UpdateEducationCardDto } from './dto/update-education-card.dto';
import { EducationCardsService } from './education-cards.service';

@ApiTags('Education Cards')
@Controller('education-cards')
export class EducationCardsController {
  constructor(private readonly educationCardsService: EducationCardsService) {}

  @ApiOperation({
    summary: 'Listar cards educativas públicas',
    description:
      'Devuelve las cards educativas activas ordenadas para mostrarse en el sitio.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de cards educativas públicas.',
    type: EducationCardResponseDto,
    isArray: true,
  })
  @Get()
  findPublic() {
    return this.educationCardsService.findPublic();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar cards educativas para administración',
    description:
      'Devuelve todas las cards educativas, incluyendo activas e inactivas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado administrativo de cards educativas.',
    type: EducationCardResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiResponse({
    status: 403,
    description:
      'El usuario no tiene permisos para administrar cards educativas.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'editor')
  @Get('admin')
  findAllAdmin() {
    return this.educationCardsService.findAllAdmin();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear card educativa',
    description:
      'Crea una nueva card educativa vinculada a un segmento de la sección Educación.',
  })
  @ApiResponse({
    status: 201,
    description: 'Card educativa creada correctamente.',
    type: EducationCardResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Los datos enviados no cumplen con las validaciones requeridas.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'editor')
  @Post('admin')
  create(@Body() createEducationCardDto: CreateEducationCardDto) {
    return this.educationCardsService.create(createEducationCardDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar card educativa',
    description:
      'Actualiza título, descripción, icono, orden o visibilidad de una card educativa.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único de la card educativa.',
    example: '9f4b8d7a-1234-4567-8901-abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Card educativa actualizada correctamente.',
    type: EducationCardResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró la card educativa indicada.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'editor')
  @Patch('admin/:id')
  update(
    @Param('id') id: string,
    @Body() updateEducationCardDto: UpdateEducationCardDto,
  ) {
    return this.educationCardsService.update(id, updateEducationCardDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Eliminar card educativa',
    description:
      'Elimina una card educativa del sistema. Para ocultarla sin eliminarla, usar is_active=false.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único de la card educativa.',
    example: '9f4b8d7a-1234-4567-8901-abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Card educativa eliminada correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró la card educativa indicada.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin')
  @Delete('admin/:id')
  remove(@Param('id') id: string) {
    return this.educationCardsService.remove(id);
  }
}
