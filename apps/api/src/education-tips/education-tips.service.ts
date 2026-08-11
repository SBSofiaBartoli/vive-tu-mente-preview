import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { CreateEducationTipDto } from './dto/create-education-tip.dto';
import type { UpdateEducationTipDto } from './dto/update-education-tip.dto';
import type { EducationTip } from './education-tip.types';
import type { PaginatedResponse } from '../common/types/paginated-response.type';
import type { ListEducationTipsAdminQueryDto } from './dto/list-education-tips-admin-query.dto';

const ensureData = <T>(data: unknown): T => {
  if (!data) {
    throw new NotFoundException('No se encontró el tip educativo indicado.');
  }

  return data as T;
};

@Injectable()
export class EducationTipsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findPublic(segmentKey?: string): Promise<EducationTip[]> {
    const today = new Date().toISOString().slice(0, 10);

    let query = this.supabaseService
      .getAdminClient()
      .from('education_tips')
      .select('*')
      .eq('is_active', true)
      .or(`starts_at.is.null,starts_at.lte.${today}`)
      .or(`ends_at.is.null,ends_at.gte.${today}`)
      .order('created_at', { ascending: false });

    if (segmentKey) {
      query = query.eq('segment_key', segmentKey);
    }

    const response = await query;

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    return ensureData<EducationTip[]>(response.data);
  }

  async findAllAdmin(
    filters: ListEducationTipsAdminQueryDto,
  ): Promise<PaginatedResponse<EducationTip>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabaseService
      .getAdminClient()
      .from('education_tips')
      .select('*', { count: 'exact' })
      .order('segment_key', { ascending: true })
      .order('created_at', { ascending: false })
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
        `title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`,
      );
    }

    const response = await query;

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    const total = response.count ?? 0;

    return {
      items: ensureData<EducationTip[]>(response.data),
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async create(
    createEducationTipDto: CreateEducationTipDto,
  ): Promise<EducationTip> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('education_tips')
      .insert({
        ...createEducationTipDto,
        is_active: createEducationTipDto.is_active ?? true,
      })
      .select()
      .single();

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    return ensureData<EducationTip>(response.data);
  }

  async update(
    id: string,
    updateEducationTipDto: UpdateEducationTipDto,
  ): Promise<EducationTip> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('education_tips')
      .update(updateEducationTipDto)
      .eq('id', id)
      .select()
      .single();

    if (response.error) {
      throw new NotFoundException('No se encontró el tip educativo indicado.');
    }

    return ensureData<EducationTip>(response.data);
  }

  async remove(id: string): Promise<{ id: string }> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('education_tips')
      .delete()
      .eq('id', id);

    if (response.error) {
      throw new NotFoundException('No se encontró el tip educativo indicado.');
    }

    return { id };
  }
}
