import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { CreateEducationTipDto } from './dto/create-education-tip.dto';
import type { UpdateEducationTipDto } from './dto/update-education-tip.dto';
import type { EducationTip } from './education-tip.types';

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

  async findAllAdmin(): Promise<EducationTip[]> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('education_tips')
      .select('*')
      .order('segment_key', { ascending: true })
      .order('created_at', { ascending: false });

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    return ensureData<EducationTip[]>(response.data);
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
