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
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AdminRolesGuard } from '../auth/admin-roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateParticipationMessageDto } from './dto/create-participation-message.dto';
import { UpdateParticipationMessageStatusDto } from './dto/update-participation-message-status.dto';
import { ParticipationMessagesService } from './participation-messages.service';

@Controller('participation/messages')
export class ParticipationMessagesController {
  constructor(
    private readonly participationMessagesService: ParticipationMessagesService,
  ) {}

  @Post()
  create(@Body() createParticipationMessageDto: CreateParticipationMessageDto) {
    return this.participationMessagesService.create(
      createParticipationMessageDto,
    );
  }

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
