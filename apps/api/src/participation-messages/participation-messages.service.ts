import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { CreateParticipationMessageDto } from './dto/create-participation-message.dto';
import type { UpdateParticipationMessageStatusDto } from './dto/update-participation-message-status.dto';
import type { ParticipationMessage } from './participation-message.types';
import type { PaginatedResponse } from '../common/types/paginated-response.type';
import type { ListParticipationMessagesAdminQueryDto } from './dto/list-participation-messages-admin-query.dto';

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
    filters: ListParticipationMessagesAdminQueryDto,
  ): Promise<PaginatedResponse<ParticipationMessage>> {
    const supabase = this.supabaseService.getAdminClient();

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('participation_messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (filters.is_read === 'true') {
      query = query.eq('is_read', true);
    }

    if (filters.is_read === 'false') {
      query = query.eq('is_read', false);
    }

    if (filters.is_starred === 'true') {
      query = query.eq('is_starred', true);
    }

    if (filters.is_starred === 'false') {
      query = query.eq('is_starred', false);
    }

    if (filters.is_contacted === 'true') {
      query = query.eq('is_contacted', true);
    }

    if (filters.is_contacted === 'false') {
      query = query.eq('is_contacted', false);
    }

    if (filters.interest_area) {
      query = query.eq('interest_area', filters.interest_area);
    }

    if (filters.search) {
      query = query.or(
        `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,message.ilike.%${filters.search}%`,
      );
    }

    const { data, error, count } =
      await query.returns<ParticipationMessage[]>();

    if (error) {
      throw new InternalServerErrorException(
        'Could not get participation messages',
      );
    }

    return {
      items: data,
      meta: {
        page,
        limit,
        total: count ?? 0,
        total_pages: Math.ceil((count ?? 0) / limit),
      },
    };
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
