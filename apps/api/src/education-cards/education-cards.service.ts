import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { CreateEducationCardDto } from './dto/create-education-card.dto';
import type { UpdateEducationCardDto } from './dto/update-education-card.dto';
import type { EducationCard } from './education-card.types';
import type { PaginatedResponse } from '../common/types/paginated-response.type';
import type { ListEducationCardsAdminQueryDto } from './dto/list-education-cards-admin-query.dto';

const ensureData = <T>(data: unknown): T => {
  if (!data) {
    throw new NotFoundException('No se encontró la card educativa indicada.');
  }

  return data as T;
};

@Injectable()
export class EducationCardsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findPublic(): Promise<EducationCard[]> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('education_cards')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    return ensureData<EducationCard[]>(response.data);
  }

  async findAllAdmin(
    filters: ListEducationCardsAdminQueryDto,
  ): Promise<PaginatedResponse<EducationCard>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabaseService
      .getAdminClient()
      .from('education_cards')
      .select('*', { count: 'exact' })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
      .range(from, to);

    if (filters.segment_key) {
      query = query.eq('segment_key', filters.segment_key);
    }

    if (filters.is_active === 'true') {
      query = query.eq('is_active', true);
    }

    if (filters.is_active === 'false') {
      query = query.eq('is_active', false);
    }

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
      );
    }

    const response = await query;

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    const total = response.count ?? 0;

    return {
      items: ensureData<EducationCard[]>(response.data),
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async create(
    createEducationCardDto: CreateEducationCardDto,
  ): Promise<EducationCard> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('education_cards')
      .insert({
        ...createEducationCardDto,
        sort_order: createEducationCardDto.sort_order ?? 0,
        is_active: createEducationCardDto.is_active ?? true,
      })
      .select()
      .single();

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    return ensureData<EducationCard>(response.data);
  }

  async update(
    id: string,
    updateEducationCardDto: UpdateEducationCardDto,
  ): Promise<EducationCard> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('education_cards')
      .update(updateEducationCardDto)
      .eq('id', id)
      .select()
      .single();

    if (response.error) {
      throw new NotFoundException('No se encontró la card educativa indicada.');
    }

    return ensureData<EducationCard>(response.data);
  }

  async remove(id: string): Promise<{ id: string }> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('education_cards')
      .delete()
      .eq('id', id);

    if (response.error) {
      throw new NotFoundException('No se encontró la card educativa indicada.');
    }

    return { id };
  }
}
