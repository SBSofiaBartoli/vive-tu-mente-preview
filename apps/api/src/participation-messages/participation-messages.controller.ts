import {
  Body,
  Controller,
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
  ApiResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AdminRolesGuard } from '../auth/admin-roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateParticipationMessageDto } from './dto/create-participation-message.dto';
import { UpdateParticipationMessageStatusDto } from './dto/update-participation-message-status.dto';
import { ParticipationMessagesService } from './participation-messages.service';
import { ParticipationMessageResponseDto } from './dto/participation-message-response.dto';
import { ListParticipationMessagesAdminQueryDto } from './dto/list-participation-messages-admin-query.dto';
import { PaginatedParticipationMessagesResponseDto } from './dto/paginated-participation-messages-response.dto';

@ApiTags('Participation Messages')
@Controller('participation/messages')
export class ParticipationMessagesController {
  constructor(
    private readonly participationMessagesService: ParticipationMessagesService,
  ) {}

  @ApiOperation({
    summary: 'Enviar mensaje de participación',
    description:
      'Recibe mensajes enviados desde el formulario público de participación del sitio.',
  })
  @ApiResponse({
    status: 201,
    description: 'Mensaje recibido correctamente.',
    type: ParticipationMessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en el formulario.',
  })
  @Post()
  create(@Body() createParticipationMessageDto: CreateParticipationMessageDto) {
    return this.participationMessagesService.create(
      createParticipationMessageDto,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar mensajes de participación',
    description:
      'Permite a usuarios administrativos listar mensajes recibidos y filtrarlos por estado.',
  })
  @ApiQuery({ name: 'is_read', required: false, example: 'false' })
  @ApiQuery({ name: 'is_starred', required: false, example: 'true' })
  @ApiQuery({ name: 'is_contacted', required: false, example: 'false' })
  @ApiResponse({
    status: 200,
    description: 'Listado de mensajes obtenido correctamente.',
    type: PaginatedParticipationMessagesResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiResponse({
    status: 403,
    description: 'El usuario no tiene permisos administrativos suficientes.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'reviewer')
  @Get('admin')
  findAllForAdmin(@Query() query: ListParticipationMessagesAdminQueryDto) {
    return this.participationMessagesService.findAllForAdmin(query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar estado de un mensaje',
    description:
      'Permite marcar un mensaje como leído, destacado o contactado desde el dashboard administrativo.',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del mensaje actualizado correctamente.',
    type: ParticipationMessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para actualizar el estado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Mensaje no encontrado.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'reviewer')
  @Patch('admin/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateParticipationMessageStatusDto,
  ) {
    return this.participationMessagesService.updateStatus(id, updateStatusDto);
  }
}
