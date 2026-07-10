import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { CreateEducationCardDto } from './dto/create-education-card.dto';
import type { UpdateEducationCardDto } from './dto/update-education-card.dto';
import type { EducationCard } from './education-card.types';

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

  async findAllAdmin(): Promise<EducationCard[]> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('education_cards')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    return ensureData<EducationCard[]>(response.data);
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
