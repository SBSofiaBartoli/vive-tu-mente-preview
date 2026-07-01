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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AdminRolesGuard } from '../auth/admin-roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateParticipationMessageDto } from './dto/create-participation-message.dto';
import { UpdateParticipationMessageStatusDto } from './dto/update-participation-message-status.dto';
import { ParticipationMessagesService } from './participation-messages.service';

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
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'reviewer')
  @Get('admin')
  findAllForAdmin(
    @Query('is_read') isRead?: string,
    @Query('is_starred') isStarred?: string,
    @Query('is_contacted') isContacted?: string,
  ) {
    return this.participationMessagesService.findAllForAdmin({
      is_read: this.parseBooleanQuery(isRead),
      is_starred: this.parseBooleanQuery(isStarred),
      is_contacted: this.parseBooleanQuery(isContacted),
    });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar estado de un mensaje',
    description:
      'Permite marcar un mensaje como leído, destacado o contactado desde el dashboard administrativo.',
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

  private parseBooleanQuery(value?: string): boolean | undefined {
    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return undefined;
  }
}
