import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { CreateParticipationMessageDto } from './dto/create-participation-message.dto';
import type { UpdateParticipationMessageStatusDto } from './dto/update-participation-message-status.dto';
import type { ParticipationMessage } from './participation-message.types';

type ParticipationMessagesFilters = {
  is_read?: boolean;
  is_starred?: boolean;
  is_contacted?: boolean;
};

@Injectable()
export class ParticipationMessagesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(
    createParticipationMessageDto: CreateParticipationMessageDto,
  ): Promise<ParticipationMessage> {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('participation_messages')
      .insert({
        full_name: createParticipationMessageDto.full_name,
        email: createParticipationMessageDto.email,
        phone: createParticipationMessageDto.phone ?? null,
        interest_area: createParticipationMessageDto.interest_area ?? null,
        message: createParticipationMessageDto.message,
      })
      .select('*')
      .returns<ParticipationMessage>()
      .single();

    if (error) {
      throw new InternalServerErrorException(
        'Could not create participation message',
      );
    }

    return data;
  }

  async findAllForAdmin(
    filters: ParticipationMessagesFilters,
  ): Promise<ParticipationMessage[]> {
    const supabase = this.supabaseService.getAdminClient();

    let query = supabase.from('participation_messages').select('*');

    if (filters.is_read !== undefined) {
      query = query.eq('is_read', filters.is_read);
    }

    if (filters.is_starred !== undefined) {
      query = query.eq('is_starred', filters.is_starred);
    }

    if (filters.is_contacted !== undefined) {
      query = query.eq('is_contacted', filters.is_contacted);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .returns<ParticipationMessage[]>();

    if (error) {
      throw new InternalServerErrorException(
        'Could not get participation messages',
      );
    }

    return data;
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateParticipationMessageStatusDto,
  ): Promise<ParticipationMessage> {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('participation_messages')
      .update(updateStatusDto)
      .eq('id', id)
      .select('*')
      .returns<ParticipationMessage>()
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        'Could not update participation message',
      );
    }

    if (!data) {
      throw new NotFoundException('Participation message not found');
    }

    return data;
  }
}
